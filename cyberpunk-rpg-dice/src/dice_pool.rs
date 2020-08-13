use crate::d6::{roll_d6, hit_count, explode_count, rolled_glitch};

pub struct RollResult {
	hits: u8,
    glitch: bool,
}

impl RollResult {
    pub fn get_hits(&self) -> u8 {
        self.hits
    }

    pub fn is_glitch(&self) -> bool {
        self.glitch
    }

    pub fn is_critical_glitch(&self) -> bool {
        self.glitch && self.hits == 0
    }
}

pub fn roll_dice(size: u8, explode: bool) -> RollResult {
	if explode {
        let mut hits = 0;
        let mut glitch = false;
        let mut cur_size = size;
        let mut first_roll = true;
		loop {
            let dice = roll_dice_pool(cur_size);
            hits += hit_count(&dice);
            if first_roll {
                glitch = rolled_glitch(&dice);
                first_roll = false;
            }
            cur_size = explode_count(&dice);
            if cur_size == 0 {
                return RollResult { hits, glitch }
            }
		}
	} else {
        let dice = roll_dice_pool(size);
        let hits = hit_count(&dice);
        let glitch = rolled_glitch(&dice);
        RollResult { hits, glitch }
    }
}

fn roll_dice_pool(size: u8) -> Vec<u8> {
	let mut dice = Vec::new();
	for _ in 0..size {
		dice.push(roll_d6());
	}
	dice
}


#[cfg(test)]
mod tests {
    use super::*;
    
    mod roll_result_tests {
        use super::*;

        #[test]
        fn no_glitch() {
            let result = RollResult { hits: 0, glitch: false };
            assert_eq!(result.is_glitch(), false);
            assert_eq!(result.is_critical_glitch(), false);
        }

        #[test]
        fn normal_glitch() {
            let result = RollResult { hits: 1, glitch: true };
            assert_eq!(result.is_glitch(), true);
            assert_eq!(result.is_critical_glitch(), false);
        }

        #[test]
        fn critical_glitch() {
            let result = RollResult { hits: 0, glitch: true };
            assert_eq!(result.is_glitch(), true);
            assert_eq!(result.is_critical_glitch(), true);
        }
    }
}