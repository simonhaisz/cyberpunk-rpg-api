use std::cmp::{max};
use crate::dice_pool::{roll_dice};

pub struct TestResult {
    success: bool,
    critical_success: bool,
    net_hits: u8,
    glitch: bool,
    critical_glitch: bool,
}

pub fn make_success_test(dice_pool: u8, threshold: u8) -> TestResult {
    let result = roll_dice(dice_pool, false);

    let success = result.get_hits() >= threshold;
    let critical_success = result.get_hits() >= threshold + 4;
    let net_hits = max(result.get_hits() - threshold, 0);
    let glitch = result.is_glitch();
    let critical_glitch = result.is_critical_glitch();
    TestResult { success, critical_success, net_hits, glitch, critical_glitch }
}

pub fn make_opposed_test(dice_pool_a: u8, dice_pool_b: u8) -> TestResult {
    
}