import * as spl from "@solana/spl-token";
import * as anchor from "@coral-xyz/anchor";

export const createMint = async (
  provider: anchor.AnchorProvider,
  decimals: number
): Promise<anchor.web3.PublicKey> => {
  const tokenMint = new anchor.web3.Keypair();
  const lamportsForMint =
    await provider.connection.getMinimumBalanceForRentExemption(
      spl.MintLayout.span
    );
  let tx = new anchor.web3.Transaction();

  // Allocate mint
  tx.add(
    anchor.web3.SystemProgram.createAccount({
      programId: spl.TOKEN_PROGRAM_ID,
      space: spl.MintLayout.span,
      fromPubkey: provider.wallet.publicKey,
      newAccountPubkey: tokenMint.publicKey,
      lamports: lamportsForMint,
    })
  );
  // Allocate wallet account
  tx.add(
    spl.createInitializeMintInstruction(
      tokenMint.publicKey,
      decimals,
      provider.wallet.publicKey,
      provider.wallet.publicKey,
      spl.TOKEN_PROGRAM_ID
    )
  );
  const signature = await provider.sendAndConfirm(tx, [tokenMint]);

  // console.log(`[${tokenMint.publicKey}] Created new mint account at ${signature}`);
  return tokenMint.publicKey;
};

export function getPDA(
  seeds: Buffer[],
  programId: anchor.web3.PublicKey
): [anchor.web3.PublicKey, number] {
  let [PDA, bump] = anchor.web3.PublicKey.findProgramAddressSync(
    seeds,
    programId
  );
  return [PDA, bump];
}
