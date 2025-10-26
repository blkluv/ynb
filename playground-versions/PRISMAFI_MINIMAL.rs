// Versión MÍNIMA para verificar que Playground funciona
use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod prediction_market {
    use super::*;

    pub fn create_market(
        ctx: Context<CreateMarket>,
        question: String,
        end_time: i64,
    ) -> Result<()> {
        let market = &mut ctx.accounts.market;
        market.authority = ctx.accounts.authority.key();
        market.question = question;
        market.end_time = end_time;
        market.total_yes = 0;
        market.total_no = 0;
        market.resolved = false;
        Ok(())
    }

    pub fn place_bet(
        ctx: Context<PlaceBet>,
        outcome: bool,
        amount: u64,
    ) -> Result<()> {
        let market = &mut ctx.accounts.market;
        
        if outcome {
            market.total_yes += amount;
        } else {
            market.total_no += amount;
        }

        // Transfer SOL
        let cpi_ctx = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            anchor_lang::system_program::Transfer {
                from: ctx.accounts.user.to_account_info(),
                to: ctx.accounts.vault.to_account_info(),
            },
        );
        anchor_lang::system_program::transfer(cpi_ctx, amount)?;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateMarket<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 100 + 8 + 8 + 8 + 1,
        seeds = [b"market", authority.key().as_ref()],
        bump
    )]
    pub market: Account<'info, Market>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct PlaceBet<'info> {
    #[account(mut)]
    pub market: Account<'info, Market>,
    
    /// CHECK: vault
    #[account(
        mut,
        seeds = [b"vault", market.key().as_ref()],
        bump
    )]
    pub vault: AccountInfo<'info>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Market {
    pub authority: Pubkey,    // 32
    pub question: String,      // 4 + 96 = 100
    pub end_time: i64,         // 8
    pub total_yes: u64,        // 8
    pub total_no: u64,         // 8
    pub resolved: bool,        // 1
}

