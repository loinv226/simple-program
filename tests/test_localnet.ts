// import "dotenv/config";
import * as spl from "@solana/spl-token";
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SimpleProgram } from "../target/types/simple_program";

import { createMint, getPDA } from "./utils";

describe("simple_program", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.SimpleProgram as Program<SimpleProgram>;
  const tokenDecimal = 6;
  const AMM_CONFIG_SEED = "amm-config-seed";

  before(async () => {});

  it("Should initialize simple success", async () => {
    let token0 = await createMint(provider, tokenDecimal);
    // console.log("token0Address:", token0.toString());

    let token1 = await createMint(provider, tokenDecimal);
    // console.log("token1Address:", token1.toString());

    // pda account for presale data + pool
    const [ammConfig, ammBump] = await getPDA(
      [Buffer.from(AMM_CONFIG_SEED)],
      program.programId
    );
    console.log("ammConfig:", ammConfig);

    const owner = anchor.Wallet.local().payer;
    const buyer = owner;

    const tokenAccount0 = anchor.web3.Keypair.generate();
    // console.log("tokenAccount0", tokenAccount0);

    const tokenAccount1 = anchor.web3.Keypair.generate();
    // console.log("tokenAccount1", tokenAccount1);

    const initTx = await program.methods
      .initializeSimple(new anchor.BN(1))
      .accounts({
        sender: owner.publicKey,
        ammConfig,
        tokenAccount0: tokenAccount0.publicKey,
        tokenAccount1: tokenAccount1.publicKey,
        token0,
        token1,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: spl.TOKEN_PROGRAM_ID,
      })
      .signers([owner, tokenAccount0, tokenAccount1])
      .rpc({ skipPreflight: true, commitment: "confirmed" });
    console.log("initTx: ", initTx);
  });
});
