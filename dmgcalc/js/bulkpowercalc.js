//TODO separate bulk calc dummy from power calc dummy, don't want properties of the target to affect the power rating of the attack

function copyTypesAndTera(dummy, pokemon) {
  dummy.type1 = pokemon.type1;
  dummy.type2 = pokemon.type2;
  if (pokemon.teraType) {
    dummy.teraType = pokemon.teraType;
  } else {
    delete dummy.teraType;
  }
}

function createBulkDummy(pokemon) {
  //create new pokemon based on p1
  var dummy = new Pokemon($('#p1'));
  //give it the desired pokemon ability, type, weight, dynamax, speed
  dummy.ability = pokemon.ability;
  dummy.isDynamax = pokemon.isDynamax;
  copyTypesAndTera(dummy, pokemon);
  dummy.weight = pokemon.weight;
  dummy.status = pokemon.status;
  dummy.HPEVs = 0;
  dummy.baseStats = { at: 48, df: 48, sa: 48, sd: 48, sp: 48 };
  dummy.boosts = { at: 0, df: 0, sa: 0, sd: 0, sp: pokemon.boosts.sp };
  dummy.curHP = 123;
  dummy.evs = { at: 0, df: 0, sa: 0, sd: 0, sp: 0, hp: 0 };
  dummy.item = '';
  dummy.ivs = { at: 31, df: 31, sa: 31, sd: 31, sp: 31, hp: 31 };
  dummy.level = 50;
  dummy.maxHP = 123;
  dummy.name = 'Ditto';
  dummy.nature = 'Hardy';
  dummy.rawStats = { at: 68, df: 68, sa: 68, sd: 68, sp: pokemon.rawStats.sp };
  dummy.stats = { df: 68, sd: 68, sp: 68, at: 68, sa: 68 };
  dummy.toxicCounter = 0;

  return dummy;
}

function createPowerDummy(pokemon) {
  //create new dummy based on input pokemon
  var dummy = new Pokemon($('#p1'));
  //give it the desired pokemon ability, type, weight, dynamax, speed
  dummy.ability = pokemon.ability;
  dummy.isDynamax = pokemon.isDynamax;
  // Neutral defender: no matchup effectiveness. STAB/Tera/boosts come from the real attacker (p1/p2).
  dummy.type1 = '???';
  dummy.type2 = '???';
  delete dummy.teraType;
  dummy.weight = pokemon.weight;
  dummy.status = pokemon.status;
  dummy.HPEVs = 0;
  dummy.baseStats = { at: 48, df: 48, sa: 48, sd: 48, sp: 48 };
  dummy.boosts = { at: 0, df: 0, sa: 0, sd: 0, sp: pokemon.boosts.sp };
  dummy.curHP = 123;
  dummy.evs = { at: 0, df: 0, sa: 0, sd: 0, sp: 0, hp: 0 };
  dummy.item = '';
  dummy.ivs = { at: 31, df: 31, sa: 31, sd: 31, sp: 31, hp: 31 };
  dummy.level = 50;
  dummy.maxHP = 123;
  dummy.name = 'Ditto';
  dummy.nature = 'Hardy';
  dummy.rawStats = { at: 68, df: 68, sa: 68, sd: 68, sp: pokemon.rawStats.sp };
  dummy.stats = { df: 68, sd: 68, sp: 68, at: 68, sa: 68 };
  dummy.toxicCounter = 0;

  return dummy;
}

function setDummyMoves(dummy) {
  //set dummy moves 0 and 1 to be hyperhyperbeam and gigagiga impact for bulk calculation
  let dumSpecAttack = dummy.moves[0];
  dumSpecAttack.bp = 999;
  dumSpecAttack.category = 'Special';
  dumSpecAttack.displayName = 'Hyper Beam';
  dumSpecAttack.hasSecondaryEffect = false;
  dumSpecAttack.hits = 1;
  dumSpecAttack.isCrit = false;
  dumSpecAttack.isMax = false;
  dumSpecAttack.isSpread = false;
  dumSpecAttack.isZ = false;
  dumSpecAttack.name = 'Hyper Beam';
  dumSpecAttack.overrides = { basePower: 999, type: '???' };
  dumSpecAttack.species = 'Ditto';
  dumSpecAttack.type = '???';
  dumSpecAttack.useMax = false;
  dumSpecAttack.zp = 999;

  let dumPhysAttack = (dummy.moves[1] = { ...dumSpecAttack });
  dumPhysAttack.category = 'Physical';
  dumPhysAttack.displayName = 'Giga Impact';
  dumPhysAttack.name = 'Giga Impact';

  return dummy;
}

function getPowers(results, side) {
  //results[0p1moves,1p2moves][move slot].damage[damage roll position, min - max]
  let powers = [0, 0, 0, 0];
  for (move in results[side]) {
    powers[move] = results[side][move].damage[0];
  }
  return powers;
}

//due to field effects, use opposite side position in results to get relevant damage
function calcBulk(pokemon, results, oppside) {
  let spDamage = results[oppside][0].damage[0];
  let physDamage = results[oppside][1].damage[0];

  //dummy attack damage vs standard ditto min roll = 374 (scales bulk to equal power)
  let spBulk = Math.round((374 * pokemon.maxHP) / spDamage);
  let physBulk = Math.round((374 * pokemon.maxHP) / physDamage);
  return [physBulk, spBulk];
}

function renderPowers(p1Powers, p2Powers) {
  var resultLocations = [[], []];
  for (var i = 0; i < 4; i++) {
    resultLocations[0].push('#p1_move' + (i + 1) + '_power');
    resultLocations[1].push('#p2_move' + (i + 1) + '_power');
  }

  for (var move = 0; move < resultLocations[0].length; move++) {
    $(resultLocations[0][move]).text(p1Powers[move]);
  }
  for (var move = 0; move < resultLocations[1].length; move++) {
    $(resultLocations[1][move]).text(p2Powers[move]);
  }
}

function renderBulk(p1Bulk, p2Bulk) {
  $('#p1 .phyBulk').text(p1Bulk[0]);
  $('#p1 .spBulk').text(p1Bulk[1]);
  $('#p2 .phyBulk').text(p2Bulk[0]);
  $('#p2 .spBulk').text(p2Bulk[1]);
}

function powercalc(p1, p2, field) {
  //create dummy versions of p1 and p2
  let p1BulkDummy = createBulkDummy(p1);
  let p2BulkDummy = createBulkDummy(p2);
  //create dummy versions of p1 and p2
  let p1PowerDummy = createPowerDummy(p1);
  let p2PowerDummy = createPowerDummy(p2);
  //calc and set aside move powers here
  //field effects are sided so need to calculate both directions
  let p1PowerResults = calculateAllMoves(p1, p2PowerDummy, field);
  let p2PowerResults = calculateAllMoves(p1PowerDummy, p2, field);

  let p1Powers = getPowers(p1PowerResults, 0);
  let p2Powers = getPowers(p2PowerResults, 1);
  renderPowers(p1Powers, p2Powers);

  //set dummy status to healthy and non dynamax for accurate bulk calc
  p1BulkDummy.status = 'Healthy';
  p1BulkDummy.isDynamax = false;
  p2BulkDummy.status = 'Healthy';
  p2BulkDummy.isDynamax = false;
  //custom moves don't play nice with dynamax so remove dummy dynamax before setting moves for bulk calc
  p1BulkDummy = setDummyMoves(p1BulkDummy);
  p2BulkDummy = setDummyMoves(p2BulkDummy);

  //PROBLEM: helping hand affects bulk calculation
  //field is not an editable object, constructor gets from html state

  //redo damage calcs for bulk calc
  p1Results = calculateAllMoves(p1, p2BulkDummy, field);
  p2Results = calculateAllMoves(p1BulkDummy, p2, field);

  let p1Bulk = calcBulk(p1, p1Results, 1);
  let p2Bulk = calcBulk(p2, p2Results, 0);
  renderBulk(p1Bulk, p2Bulk);
}
