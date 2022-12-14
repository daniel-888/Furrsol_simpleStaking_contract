// Migrations are an early feature. Currently, they're nothing more than this
// single deploy script that's invoked from the CLI, injecting a provider
// configured from the workspace's Anchor.toml.

import * as anchor from '@project-serum/anchor';
import { AccountLayout, TOKEN_PROGRAM_ID, createAccount, createInitializeAccountInstruction } from '@solana/spl-token';
import { IDL } from '../target/types/furrsol_extra_staking';
const { SystemProgram, Keypair, PublicKey } = anchor.web3;
const token_mint = 'GnBw4qZs3maF2d5ziQmGzquQFnGV33NUcEujTQ3CbzP3';
const PROGRAM_ID = '5tvBzSCacUn2maQkeaU7TzNX7rspSpEnxHagzZceaP7G';
module.exports = async function (provider) {
  // Configure client to use the provider.
  anchor.setProvider(provider);
  const aTokenAccount = new Keypair();
  const aTokenAccountRent = await provider.connection.getMinimumBalanceForRentExemption(
    AccountLayout.span
  )
  const program = new anchor.Program(IDL, new PublicKey(PROGRAM_ID), provider);
  let [vaultPDA, _nonce] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from('furrsol vault')],
    program.programId
  );
  const tx = await program.rpc.createVault(_nonce, {
    accounts: {
      vault: vaultPDA,
      admin: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    },
    signers: [aTokenAccount],
    instructions: [
      SystemProgram.createAccount({
        fromPubkey: provider.wallet.publicKey,
        newAccountPubkey: aTokenAccount.publicKey,
        lamports: aTokenAccountRent,
        space: AccountLayout.span,
        programId: TOKEN_PROGRAM_ID
      }),
      createInitializeAccountInstruction(
        aTokenAccount.publicKey,
        new PublicKey(token_mint),
        vaultPDA,
        TOKEN_PROGRAM_ID
      )
    ]
  })
  console.log("furrsol vault: ", vaultPDA.toString());
  console.log("furrsol tokenAccount: ", aTokenAccount.publicKey.toString());


  let [poolData, nonce_data] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from('furrsol data')],
  program.programId);

  const tx_data = await program.rpc.createData(nonce_data, {
    accounts: {
      data: poolData,
      admin: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId
    }
  });
  console.log("tx_data: ", tx_data);
  // Add your deploy script here.
};
