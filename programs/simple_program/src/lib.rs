use anchor_lang::prelude::*;

use instructions::*;

pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

declare_id!("ESyxaZxC2oBA4FmsRe94U62hqQW2e8hSPZWMEnrarUM");

#[program]
pub mod simple_program {
    use super::*;

    pub fn initialize_simple(ctx: Context<InitializeSimpleCtx>, supply: u64) -> Result<()> {
        init_simple::initialize_simple(ctx, supply)
    }
}
