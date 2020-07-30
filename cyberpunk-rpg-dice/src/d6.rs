use rand::{thread_rng, Rng};

fn validate_d6(die: u8) {
	if die < 1 || die > 6 {
		panic!("D6 can only have a value between 1 and 6: {}", die);
	}
}

pub fn roll_d6() -> u8 {
	let mut rng = thread_rng();
	let die: u8 = rng.gen_range(1, 7);
	die
}

fn is_hit(die: u8) -> bool {
    validate_d6(die);
	die >= 5
}

pub fn hit_count(dice: &Vec<u8>) -> u8 {
    let mut hit_count = 0;
    for d in dice {
        if is_hit(*d) {
            hit_count += 1;
        }
    }
    hit_count
}

fn is_explode(die: u8) -> bool {
    validate_d6(die);
	die == 6
}

pub fn explode_count(dice: &Vec<u8>) -> u8 {
    let mut explode_count = 0;
    for d in dice {
        if is_explode(*d) {
            explode_count += 1;
        }
    }
    explode_count
}

fn is_glitch(die: u8) -> bool {
    validate_d6(die);
    die == 1
}

pub fn rolled_glitch(dice: &Vec<u8>) -> bool {
    let mut glitch_count = 0;
    for d in dice {
        if is_glitch(*d) {
            glitch_count += 1;
        }
    }
    glitch_count as f32 >= (dice.len() as f32 / 2f32).ceil()
}

#[cfg(test)]
mod tests {
	use super::*;
    
    mod is_hit_tests {
        use super::*;

        #[test]
        fn hit_1() {
            assert!(!is_hit(1));
        }
        
        #[test]
        fn hit_2() {
            assert!(!is_hit(2));
        }

        #[test]
        fn hit_3() {
            assert!(!is_hit(3));
        }
        
        #[test]
        fn hit_4() {
            assert!(!is_hit(4));
        }
        
        #[test]
        fn hit_5() {
            assert!(is_hit(5));
        }
        
        #[test]
        fn hit_6() {
            assert!(is_hit(6));
        }
    }

    mod hit_count_tests {
        use super::*;

        #[test]
        fn empty() {
            assert_eq!(hit_count(&vec![]), 0);
        }

        #[test]
        fn some() {
            assert_eq!(hit_count(&vec![1, 2, 3, 4, 5, 6]), 2);
        }
    }

    mod explode_tests {
        use super::*;

        #[test]
        fn expode_1() {
            assert!(!is_explode(1));
        }
        
        #[test]
        fn expode_2() {
            assert!(!is_explode(2));
        }

        #[test]
        fn expode_3() {
            assert!(!is_explode(3));
        }
        
        #[test]
        fn expode_4() {
            assert!(!is_explode(4));
        }
        
        #[test]
        fn expode_5() {
            assert!(!is_explode(5));
        }
        
        #[test]
        fn expode_6() {
            assert!(is_explode(6));
        }
    }

    mod explode_count_tests {
        use super::*;

        #[test]
        fn empty() {
            assert_eq!(explode_count(&vec![]), 0);
        }

        #[test]
        fn some() {
            assert_eq!(explode_count(&vec![1, 2, 3, 4, 5, 6]), 1);
        }
    }

    mod glitch_tests {
        use super::*;

        #[test]
        fn glitch_1() {
            assert!(is_glitch(1));
        }
        
        #[test]
        fn glitch_2() {
            assert!(!is_glitch(2));
        }

        #[test]
        fn glitch_3() {
            assert!(!is_glitch(3));
        }
        
        #[test]
        fn glitch_4() {
            assert!(!is_glitch(4));
        }
        
        #[test]
        fn glitch_5() {
            assert!(!is_glitch(5));
        }
        
        #[test]
        fn glitch_6() {
            assert!(!is_glitch(6));
        }
    }

    mod rolled_glitch_tests {
        use super::*;

        #[test]
        fn empty() {
            assert_eq!(rolled_glitch(&vec![]), true);
        }

        #[test]
        fn zero_for_three() {
            assert_eq!(rolled_glitch(&vec![2, 4, 6]), false);
        }

        #[test]
        fn one_for_three() {
            assert_eq!(rolled_glitch(&vec![1, 4, 6]), false);
        }

        #[test]
        fn two_for_three() {
            assert_eq!(rolled_glitch(&vec![1, 1, 4]), true);
        }

        #[test]
        fn three_for_three() {
            assert_eq!(rolled_glitch(&vec![1, 1, 1]), true);
        }
    }
}
