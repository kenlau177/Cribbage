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

function compute_expected_crib_impact(hand_names, hand_suits) {
	var general_crib = {
		'A': {'A': 5.38, '2': 4.23, '3': 4.52, '4': 5.43, '5': 5.45, '6': 3.85, '7': 3.85, '8': 3.8, 
					'9': 3.4, '10': 3.42, 'J': 3.65, 'Q': 3.42, 'K': 3.41},
		'2': {'2': 5.72, '3': 7, '4': 4.52, '5': 5.45, '6': 3.93, '7': 3.81, '8': 3.66, '9': 3.71, 
					'10': 3.55, 'J': 3.84, 'Q': 3.58, 'K': 3.52},
		'3': {'3': 5.94, '4': 4.91, '5': 5.97, '6':	3.81, '7': 3.58, '8':	3.92, '9': 3.78,
					'10':	3.57, 'J': 3.90, 'Q':	3.59, 'K': 3.67},
		'4': {'4': 5.63, '5':	6.48, '6': 3.85, '7':	3.72, '8': 3.83, '9':	3.72, '10':	3.59, 'J': 3.88,
					'Q': 3.59, 'K':	3.60},
		'5': {'5': 8.79, '6':	6.63, '7': 6.01, '8':	5.48, '9': 5.43, '10': 6.66, 'J':	7, 'Q':	6.63, 'K': 6.66},
		'6': {'6': 5.76, '7':	4.98, '8': 4.63, '9':	5.13, '10':	3.17, 'J': 3.41, 'Q':	3.23, 'K': 3.13},
		'7': {'7': 5.92, '8':	6.53, '9': 4.04, '10': 3.23, 'J':	3.53, 'Q': 3.23, 'K':	3.26},
		'8': {'8': 5.45, '9':	4.72, '10':	3.80, 'J': 3.52, 'Q':	3.19, 'K': 3.16},
		'9': {'9': 5.16, '10': 4.29, 'J':	3.97, 'Q': 2.99, 'K':	3.06},
		'10': {'10': 4.76, 'J':	4.61, 'Q': 3.31, 'K':	2.84},
		'J': {'J': 5.33, 'Q':	4.81, 'K': 3.96},
		'Q': {'Q': 4.79, 'K':	3.46},
		'K': {'K': 4.58}};

	//var gen_crib_vals = Object.values(general_crib);
	var gen_crib_vals = [];
	for(var key in general_crib) {
    gen_crib_vals.push(general_crib[key]);
	}
	var total = 0;
	var count = 0;
	for(var i = 0; i < gen_crib_vals.length; i++) {
	  for(var j = 0; j < Object.keys(gen_crib_vals[i]).length; j++) {
	  	var tmp_gen_crib_vals = [];
  		for(var key in gen_crib_vals[i]) {
		    tmp_gen_crib_vals.push(gen_crib_vals[i][key]);
			}
	  	//total += Object.values(gen_crib_vals[i])[j];
	  	total += tmp_gen_crib_vals[j];
	  	count++;
	  }
	}
	var gen_crib_avg = total/count;

	var map_name_to_num = {'A':1, '2':2, '3':3, '4':4, '5':5, '6':6, '7':7, '8':8, '9':9, '10':10, 
												'J':11, 'Q':12, 'K':13};

	var out = [];
	for (var h1 in hand_names) {
		for (var h2 in hand_names) {
			if (h1 < h2) {
				var tmp_hand1 = hand_names[h1];
				var tmp_hand2 = hand_names[h2];
				if (map_name_to_num[tmp_hand1] <= map_name_to_num[tmp_hand2]) {
					var tmp_crib_val = general_crib[tmp_hand1][tmp_hand2];	
				} else {
					var tmp_crib_val = general_crib[tmp_hand2][tmp_hand1];	
				}
				out.push(tmp_crib_val - gen_crib_avg);
			}
		}
	}

	return out;
}

function compute_expected_hand_helper(fh, cards_keep, suits_keep) {
	var tot_score = 0;
	var count = 0;
	var min = 50;
	var max = -1;
	for (f in fh) {
		var card_cut = fh[f].split("-")[0];
		var suit_cut = fh[f].split("-")[1];

		var score_tmp = score_hand([card_cut, cards_keep[0], cards_keep[1],
														cards_keep[2], cards_keep[3]],
														[suit_cut, suits_keep[0], suits_keep[1],
														suits_keep[2], suits_keep[3]], card_cut, suit_cut);
		if (score_tmp < min) {
			min = score_tmp;
		}
		if (score_tmp > max) {
			max = score_tmp;
		}

		tot_score += score_tmp;
		count++;
	}
  return {'score':tot_score/count, 'min_score':min, 'max_score':max};
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

	var out = [];
	for (var h1 in hand_names) {
		for (var h2 in hand_names) {
			if (h1 < h2) {
				var tmp_hand_names = hand_names.slice(0);
				var tmp_hand_suits = hand_suits.slice(0);
				tmp_hand_names.splice(h2,1);
				tmp_hand_names.splice(h1,1);
				tmp_hand_suits.splice(h2,1);
				tmp_hand_suits.splice(h1,1);
				out.push(compute_expected_hand_helper(fh, tmp_hand_names, tmp_hand_suits));
			}
		}
	}

	return out;
}

function find_indices_ordered(inp, desc) {
	var outp = [];
	for (var i=0; i<inp.length; i++) {
		outp.push(i);
	}
	if (desc) {
		outp.sort(function(a,b) { return inp[b] - inp[a]; });	
	} else {
		outp.sort(function(a,b) { return inp[a] - inp[b]; });	
	}
	return outp;
}

function optimize(hand_names, hand_suits, yourcrib) {

	var exp_scores_hand = compute_expected_hand(hand_names, hand_suits);
	var exp_scores_crib = compute_expected_crib_impact(hand_names, hand_suits);

	if (!yourcrib) {
		exp_scores_crib = exp_scores_crib.map(function(x) { return -x; });
	}

	var exp_scores = [];
	for (var i = 0; i < exp_scores_hand.length; i++){
  	exp_scores.push((exp_scores_hand[i].score + exp_scores_crib[i]).toFixed(1));
	}

	var tmp = find_indices_ordered(exp_scores, true);

	var idx_to_both_hand_names_suits = {};
	var idx = 0;
	for (var h1 in hand_names) {
		for (var h2 in hand_names) {
			if (h1 < h2) {
				idx_to_both_hand_names_suits[idx.toString()] = hand_names[h1].concat(hand_suits[h1]).concat('-')
																												.concat(hand_names[h2]).concat(hand_suits[h2]);
				idx++;																												
			}
		}
	}

	var out = [];
	for (var t in tmp) {
		out.push([idx_to_both_hand_names_suits[tmp[t].toString()], exp_scores[tmp[t]], 
			exp_scores_hand[tmp[t]].score.toFixed(1),
			exp_scores_crib[tmp[t]].toFixed(1),
			exp_scores_hand[tmp[t]].min_score.toFixed(0),
			exp_scores_hand[tmp[t]].max_score.toFixed(0)]);
	}

	return out;
}


