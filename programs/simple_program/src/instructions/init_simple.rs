use anchor_lang::prelude::*;

use crate::constants::*;
use crate::error::ErrorCode;
use crate::state::presale::*;
use anchor_spl::token::{TokenAccount, Mint, Token};


#[derive(Accounts)]
pub struct InitializeSimpleCtx<'info> {
    #[account(mut)]
    pub sender: Signer<'info>,
    // data
    #[account(
        init, payer = sender, 
        space = 8 + AmmConfig::INIT_SPACE, 
        seeds = [AMM_CONFIG],
        bump)]
    pub amm_config: Box<Account<'info, AmmConfig>>,
    #[account(
        init,
        payer = sender,
        token::mint=token0,
        token::authority=amm_config,
    )]
    pub token_account0: Box<Account<'info, TokenAccount>>,
    #[account(
        init,
        payer = sender,
        token::mint=token1,
        token::authority=amm_config,
    )]
    pub token_account1: Box<Account<'info, TokenAccount>>,
    // mint
    pub token0: Account<'info, Mint>,
    pub token1: Account<'info, Mint>,
    // program
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

pub fn initialize_simple(
    ctx: Context<InitializeSimpleCtx>,
    supply: u64
) -> Result<()> {
    require!(supply > 0, ErrorCode::InputInvalid);

    ctx.accounts.amm_config.owner = ctx.accounts.sender.key();
    
    Ok(())
}