var set_matrix = [];
set_matrix.push([[0], [1], [2], [3], [4]]);
set_matrix.push([[0,1], [0,2], [0,3], [0,4], [1,2], [1,3], [1,4],
								 [2,3], [2,4], [3,4]]);
set_matrix.push([[0,1,2],[0,1,3],[0,2,3],[1,2,3],[0,1,4],[0,2,4],[1,2,4],[0,3,4],[1,3,4],[2,3,4]]);
set_matrix.push([[0,1,2,3], [0,1,2,4], [0,1,3,4], [0,2,3,4], [1,2,3,4]]);
set_matrix.push([[0,1,2,3,4]]);

function convert_hand_to_nums(current_nums) {
	var out = current_nums.slice();
	for (i=0; i<out.length; i++) {
		if (out[i] === 'A') { out[i] = 1; }
		if (out[i] === 'J') { out[i] = 10; }
		if (out[i] === 'Q') { out[i] = 10; }
		if (out[i] === 'K') { out[i] = 10; }
		out[i] = Number(out[i]);
	}
	return out;
}

function convert_hand_to_ordinal(current_nums) {
	var out = current_nums.slice();
	for (i=0; i<out.length; i++) {
		if (out[i] === 'A') { out[i] = 1; }
		if (out[i] === 'J') { out[i] = 11; }
		if (out[i] === 'Q') { out[i] = 12; }
		if (out[i] === 'K') { out[i] = 13; }
		out[i] = Number(out[i]);
	}
	return out;	
}

function score_hand(hand_names, hand_suits, cut_card_name, cut_card_suit) {
	var hand = convert_hand_to_nums(hand_names);
	var hand_ordinal = convert_hand_to_ordinal(hand_names);
	var out = score_15s(hand) + score_pairs(hand_names) + score_flush_hand(hand_suits, cut_card_suit) + 
							score_nobs(hand_names, hand_suits, cut_card_name, cut_card_suit) + 
							score_runs(hand_ordinal);
	return out;
}

function score_15s(hand) {
	var score = 0;
	// Look through the '2' sets, then the 3, 4, and 5
	for (set_index=1; set_index < 5; set_index++) {
		for (set_length=0; set_length < set_matrix[set_index].length; set_length++) {
			var sum = 0;
			// Add up the cards pointed to by the indices of the set
			for (set_member=0; set_member < set_matrix[set_index][set_length].length; set_member++) {
				sum += hand[set_matrix[set_index][set_length][set_member]];
			}
			if (sum === 15) {
				score += 2;
			}
		}
	}
	return score;
}

function score_pairs(hand) {
	var score = 0;

	// Look through the sets of indices in the "2" set
	for (set_length = 0; set_length < set_matrix[1].length; set_length++) {
		//Check the two cards pointed at by the indicies and see if they're the same
		if (hand[set_matrix[1][set_length][0]] === hand[set_matrix[1][set_length][1]]) {
			score += 2;
		}
	}
	return score;
}

function score_flush_hand(hand_suits, cut_suit) {
	var counted_suits = hand_suits.reduce(function(all_suits, suit) { 
											  if (suit in all_suits) {
											    all_suits[suit]++;
											  }
											  else {
											    all_suits[suit] = 1;
											  }
											  return all_suits;
											}, {});
	//var counted_suits_vals = Object.values(counted_suits);
	var counted_suits_vals = [];
	for(var key in counted_suits) {
    counted_suits_vals.push(counted_suits[key]);
	}

	if (counted_suits_vals.indexOf(5) > -1) {
		return 5;
	} else if (counted_suits_vals.indexOf(4) > -1) {
		if (counted_suits[cut_suit] === 4) {
			return 0;
		} else {
			return 4;
		}
	} else {
		return 0;
	}
}

function score_flush_crib(hand_suits) {
	var suit = hand_suits[0];

	// Check the suit of each card in the hand against the suit of the first card.
	// As soon as they don't match, skip out of the routine
	for (i = 1; i < hand_suits.length; i++) {
		if (hand_suits[i] != suit) {
			return 0;
		}
	}

	return hand_suits.length;
}

function score_nobs(hand_names, hand_suits, cut_card_name, cut_card_suit) {
	if (cut_card_name === 'J') {
		return 0;
	} else {
		// Loop over all the cards in the hand, check to see if it's a Jack, and if it is, check the suit.
		for (i=0; i<hand_names.length; i++) {
			if (hand_names[i] === 'J' && hand_suits[i] === cut_card_suit) {
				return 1;
			}
		}	
	}
	
	// We haven't left the routine yet, so the right jack is not in the hand.
	return 0;
}

function score_runs(hand) {
	var hand_ordinal = hand.slice();
	hand_ordinal.sort(function(a, b) { return a - b; });
	var score = 0;
	var run_found = false;

	// Look for 5 card runs first, then 4 then 3.
	for (i = 4; i > 1; i--) {
		var sets = set_matrix[i];

		// Iterate over each of the sets available for the length under examination.
		for (set_index = 0; set_index < sets.length; set_index++) {
			var local_run_found = true;

			// Look at each index in the set, from the first to the second-to-last
			for (set_member=0; set_member < sets[set_index].length-1; set_member++) {
				first = hand_ordinal[sets[set_index][set_member]];
				second = hand_ordinal[sets[set_index][set_member + 1]];

				// Check to see if the second card is only 1 more than the current card.
				// If it isn't, skip out of the loop. The two cards are not consecutive, so 
				// we can't have a run of this length.
				if (second - first !== 1) {
					local_run_found = false;
					break;
				}
			}
			// If we're this far and the local_run_found flag has not been reset, 
			// the current set defines a group of array indicies that are a run.
			if (local_run_found) {
				score += (i+1);
				run_found = true;
			}
		}

		// If a run has been found, don't look at the smaller runs
		if (run_found) 
			break;
	}
	
	return score;
}





