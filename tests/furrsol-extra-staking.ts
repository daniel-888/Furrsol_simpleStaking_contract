import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { FurrsolExtraStaking } from "../target/types/furrsol_extra_staking";

describe("furrsol-extra-staking", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());

  const program = anchor.workspace.FurrsolExtraStaking as Program<FurrsolExtraStaking>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.rpc.createVault();
    console.log("Your transaction signature", tx);
  });
});
