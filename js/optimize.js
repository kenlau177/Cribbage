// https://rosettacode.org/wiki/Combinations#JavaScript
function combinations(arr, k){
    var i,
    subI,
    ret = [],
    sub,
    next;
    for(i = 0; i < arr.length; i++){
        if(k === 1){
            ret.push( [ arr[i] ] );
        }else{
            sub = combinations(arr.slice(i+1, arr.length), k-1);
            for(subI = 0; subI < sub.length; subI++ ){
                next = sub[subI];
                next.unshift(arr[i]);
                ret.push( next );
            }
        }
    }
    return ret;
}

function compute_expected_crib_hand_helper(fh, card, suit) {
	var fh_combn = combinations(fh, 4);
	var tot_score = 0;
	var count = 0;
	for (c in fh_combn) {
		var card1 = fh_combn[c][0].split("-")[0];
		var card2 = fh_combn[c][1].split("-")[0];
		var card3 = fh_combn[c][2].split("-")[0];
		var card4 = fh_combn[c][3].split("-")[0];

		var suit1 = fh_combn[c][0].split("-")[1];
		var suit2 = fh_combn[c][1].split("-")[1];
		var suit3 = fh_combn[c][2].split("-")[1];
		var suit4 = fh_combn[c][3].split("-")[1];		

		tot_score += score_hand([card,card1,card2,card3,card4], [suit,suit1,suit2,suit3,suit4], 
									suit4);
		count++;
	}
  return tot_score/count;
}
/***** KEEP THIS *****
function compute_expected_crib_hand(hand_names, hand_suits) {

	var full_hand_names = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
	var full_hand_suits = ['S', 'H', 'C', 'D'];

	var fh = [];
	for (n in full_hand_names) {
		for (s in full_hand_suits) {
			fh.push(full_hand_names[n].concat('-').concat(full_hand_suits[s]));
		}
	}

	for (i=0; i<hand_names.length; i++) {
		fh.splice(fh.indexOf(hand_names[i].concat('-').concat(hand_suits[i])), 1);		
	}

	var score1 = compute_expected_crib_hand_helper(fh, hand_names[0], hand_suits[0]);
	var score2 = compute_expected_crib_hand_helper(fh, hand_names[1], hand_suits[1]);
	var score3 = compute_expected_crib_hand_helper(fh, hand_names[2], hand_suits[2]);
	var score4 = compute_expected_crib_hand_helper(fh, hand_names[3], hand_suits[3]);
	var score5 = compute_expected_crib_hand_helper(fh, hand_names[4], hand_suits[4]);
	
	return [score1, score2, score3, score4, score5];
}
*/
function compute_theoretical_crib_hand_tmp(card) {
	var full_hand_names = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
	var full_hand_suits = ['S', 'H', 'C', 'D'];
	var fh = [];
	for (n in full_hand_names) {
		for (s in full_hand_suits) {
			fh.push(full_hand_names[n].concat('-').concat(full_hand_suits[s]));
		}
	}
	fh.splice(fh.indexOf(card.concat('-').concat('S')), 1);		
	
	var out = compute_expected_crib_hand_helper(fh, card, 'S');
	return out;
}

function compute_expected_crib_hand(hand_names, hand_suits) {
	var theo_crib = {
		'A': 4.758,
		'2': 4.983,
		'3': 5.14,
		'4': 5.146,
		'5': 6.96,
		'6': 5.1,
		'7': 4.989,
		'8': 4.956,
		'9': 4.838,
		'10': 4.767,
		'J': 4.936,
		'Q': 4.602,
		'K': 4.408 };

	return [theo_crib[hand_names[0]], theo_crib[hand_names[1]], theo_crib[hand_names[2]], 
					theo_crib[hand_names[3]], theo_crib[hand_names[4]]];
}

function compute_expected_hand_helper(fh, cards_keep, suits_keep) {
	var tot_score = 0;
	var count = 0;
	for (f in fh) {

		var card_cut = fh[f].split("-")[0];
		var suit_cut = fh[f].split("-")[1];

		tot_score += score_hand([card_cut, cards_keep[0], cards_keep[1],
														cards_keep[2], cards_keep[3]],
														[suit_cut, suits_keep[0], suits_keep[1],
														suits_keep[2], suits_keep[3]], suit_cut);
		count++;
	}
  return tot_score/count;
}

function compute_expected_hand(hand_names, hand_suits) {
	full_hand_names = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
	full_hand_suits = ['S', 'H', 'C', 'D'];

	var fh = [];
	for (n in full_hand_names) {
		for (s in full_hand_suits) {
			fh.push(full_hand_names[n].concat('-').concat(full_hand_suits[s]));
		}
	}
	
	for (i=0; i<hand_names.length; i++) {
		fh.splice(fh.indexOf(hand_names[i].concat('-').concat(hand_suits[i])), 1);		
	}

	var score1 = compute_expected_hand_helper(fh, hand_names.slice(1), hand_suits.slice(1));
	var score2 = compute_expected_hand_helper(fh, hand_names.slice(0,1).concat(hand_names.slice(2)), 
																						hand_suits.slice(0,1).concat(hand_suits.slice(2)));
	var score3 = compute_expected_hand_helper(fh, hand_names.slice(0,2).concat(hand_names.slice(3)), 
																						hand_suits.slice(0,2).concat(hand_suits.slice(3)));
	var score4 = compute_expected_hand_helper(fh, hand_names.slice(0,3).concat(hand_names.slice(4)), 
																						hand_suits.slice(0,3).concat(hand_suits.slice(4)));
	var score5 = compute_expected_hand_helper(fh, hand_names.slice(0,4), hand_suits.slice(0,4));

	return [score1, score2, score3, score4, score5];
}

function findIndicesOfMax(inp, count) {
  var outp = [];
  for (var i = 0; i < inp.length; i++) {
    outp.push(i); // add index to output array
    if (outp.length > count) {
      outp.sort(function(a, b) { return inp[b] - inp[a]; }); // descending sort the output array
      outp.pop(); // remove the last index (index of smallest element in output array)
    }
  }
  return outp;
}

function optimize(hand_names, hand_suits, yourcrib) {

	var exp_scores_hand = compute_expected_hand(hand_names, hand_suits);
	var exp_scores_crib = compute_expected_crib_hand(hand_names, hand_suits);

	if (yourcrib) {
		var exp_scores = [];
		for (var i = 0; i < exp_scores_hand.length; i++){
	  	exp_scores.push((exp_scores_hand[i] + exp_scores_crib[i]).toFixed(1));
		}
	} else {
		var exp_scores = [];
		for (var i = 0; i < exp_scores_hand.length; i++){
	  	exp_scores.push((exp_scores_hand[i] - exp_scores_crib[i]).toFixed(1));
		}
	}

	var tmp = findIndicesOfMax(exp_scores, 3);

	return [[hand_names[tmp[0]].concat(hand_suits[tmp[0]]), exp_scores[tmp[0]], 
					exp_scores_hand[tmp[0]].toFixed(1), exp_scores_crib[tmp[0]].toFixed(1)],
					[hand_names[tmp[1]].concat(hand_suits[tmp[1]]), exp_scores[tmp[1]], 
					exp_scores_hand[tmp[1]].toFixed(1), exp_scores_crib[tmp[1]].toFixed(1)],
					[hand_names[tmp[2]].concat(hand_suits[tmp[2]]), exp_scores[tmp[2]], 
					exp_scores_hand[tmp[2]].toFixed(1), exp_scores_crib[tmp[2]].toFixed(1)]];
}


