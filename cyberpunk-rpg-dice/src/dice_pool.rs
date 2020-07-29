use crate::d6::{roll_d6, hit_count, explode_count};

pub struct RollResult {
	hits: u8,
	glitch: bool,
}

pub fn roll_dice(size: u8, explode: bool) -> RollResult {
    let mut total_hits = 0;
    let glitch = false;
	if explode {
		let mut cur_size = size;
		loop {
			let dice = roll_dice_pool(cur_size);
			total_hits += hit_count(&dice);
            cur_size = explode_count(&dice);
            if cur_size == 0 {
                break;
            }
		}
	} else {
        total_hits = hit_count(&roll_dice_pool(size));
    }
    RollResult { hits: total_hits, glitch }
}

fn roll_dice_pool(size: u8) -> Vec<u8> {
	let mut dice = Vec::new();
	for _ in 0..size {
		dice.push(roll_d6());
	}
	dice
}
