use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct AmmConfig {
    pub owner: Pubkey,
    pub mint: Pubkey,
}
