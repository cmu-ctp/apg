using UnityEngine;

 public static class Art{
	public static class Backgrounds{
		public static ImageEntry LandToHorizon = new ImageEntry{ name = "Backgrounds/LandToHorizon" };
		public static ImageSet set = new ImageSet( new ImageEntry[]{ LandToHorizon } );
		public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		public static class sky{
			public static ImageEntry sky11 = new ImageEntry{ name = "Backgrounds/sky/sky11" };
			public static ImageEntry sky23 = new ImageEntry{ name = "Backgrounds/sky/sky23" };
			public static ImageEntry sky27 = new ImageEntry{ name = "Backgrounds/sky/sky27" };
			public static ImageEntry sky4 = new ImageEntry{ name = "Backgrounds/sky/sky4" };
			public static ImageEntry sky5 = new ImageEntry{ name = "Backgrounds/sky/sky5" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ sky11, sky23, sky27, sky4, sky5 } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
	}
	public static class Bags{
		public static ImageEntry bag1 = new ImageEntry{ name = "Bags/bag1" };
		public static ImageEntry purse1 = new ImageEntry{ name = "Bags/purse1" };
		public static ImageSet set = new ImageSet( new ImageEntry[]{ bag1, purse1 } );
		public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
	}
	public static class Bosses{
		public static ImageEntry beardface = new ImageEntry{ name = "Bosses/beardface" };
		public static ImageEntry beardface2 = new ImageEntry{ name = "Bosses/beardface2" };
		public static ImageSet set = new ImageSet( new ImageEntry[]{ beardface, beardface2 } );
		public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
	}
	public static class Buildings{
		public static ImageEntry airport = new ImageEntry{ name = "Buildings/airport" };
		public static ImageEntry barn = new ImageEntry{ name = "Buildings/barn" };
		public static ImageEntry beer = new ImageEntry{ name = "Buildings/beer" };
		public static ImageEntry biplane = new ImageEntry{ name = "Buildings/biplane" };
		public static ImageEntry blimp = new ImageEntry{ name = "Buildings/blimp" };
		public static ImageEntry cannon = new ImageEntry{ name = "Buildings/cannon" };
		public static ImageEntry fairy1a = new ImageEntry{ name = "Buildings/fairy1a" };
		public static ImageEntry greenhouse = new ImageEntry{ name = "Buildings/greenhouse" };
		public static ImageEntry hospital = new ImageEntry{ name = "Buildings/hospital" };
		public static ImageEntry pill1a = new ImageEntry{ name = "Buildings/pill1a" };
		public static ImageEntry policecar = new ImageEntry{ name = "Buildings/policecar" };
		public static ImageEntry policehelicopter = new ImageEntry{ name = "Buildings/policehelicopter" };
		public static ImageEntry policestation = new ImageEntry{ name = "Buildings/policestation" };
		public static ImageEntry pond = new ImageEntry{ name = "Buildings/pond" };
		public static ImageEntry straydots = new ImageEntry{ name = "Buildings/straydots" };
		public static ImageEntry sunegg = new ImageEntry{ name = "Buildings/sunegg" };
		public static ImageEntry tendril = new ImageEntry{ name = "Buildings/tendril" };
		public static ImageEntry turtle2 = new ImageEntry{ name = "Buildings/turtle2" };
		public static ImageSet set = new ImageSet( new ImageEntry[]{ airport, barn, beer, biplane, blimp, cannon, fairy1a, greenhouse, hospital, pill1a, policecar, policehelicopter, policestation, pond, straydots, sunegg, tendril, turtle2 } );
		public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		public static class Broccolis{
			public static ImageEntry broccoli1 = new ImageEntry{ name = "Buildings/Broccolis/broccoli1" };
			public static ImageEntry broccoli2 = new ImageEntry{ name = "Buildings/Broccolis/broccoli2" };
			public static ImageEntry broccoli3 = new ImageEntry{ name = "Buildings/Broccolis/broccoli3" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ broccoli1, broccoli2, broccoli3 } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
		public static class Cows{
			public static ImageEntry cow1 = new ImageEntry{ name = "Buildings/Cows/cow1" };
			public static ImageEntry cow2 = new ImageEntry{ name = "Buildings/Cows/cow2" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ cow1, cow2 } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
		public static class Flowers{
			public static ImageEntry flower1 = new ImageEntry{ name = "Buildings/Flowers/flower1" };
			public static ImageEntry flower2 = new ImageEntry{ name = "Buildings/Flowers/flower2" };
			public static ImageEntry flower3 = new ImageEntry{ name = "Buildings/Flowers/flower3" };
			public static ImageEntry flower4 = new ImageEntry{ name = "Buildings/Flowers/flower4" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ flower1, flower2, flower3, flower4 } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
		public static class stars{
			public static ImageEntry star1 = new ImageEntry{ name = "Buildings/stars/star1" };
			public static ImageEntry star2 = new ImageEntry{ name = "Buildings/stars/star2" };
			public static ImageEntry star3 = new ImageEntry{ name = "Buildings/stars/star3" };
			public static ImageEntry star4 = new ImageEntry{ name = "Buildings/stars/star4" };
			public static ImageEntry star5 = new ImageEntry{ name = "Buildings/stars/star5" };
			public static ImageEntry star6 = new ImageEntry{ name = "Buildings/stars/star6" };
			public static ImageEntry star7 = new ImageEntry{ name = "Buildings/stars/star7" };
			public static ImageEntry star8 = new ImageEntry{ name = "Buildings/stars/star8" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ star1, star2, star3, star4, star5, star6, star7, star8 } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
		public static class StinkClouds{
			public static ImageEntry stinkcloud1 = new ImageEntry{ name = "Buildings/StinkClouds/stinkcloud1" };
			public static ImageEntry stinkcloud2 = new ImageEntry{ name = "Buildings/StinkClouds/stinkcloud2" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ stinkcloud1, stinkcloud2 } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
		public static class StinkLines{
			public static ImageEntry stinky1 = new ImageEntry{ name = "Buildings/StinkLines/stinky1" };
			public static ImageEntry stinky2 = new ImageEntry{ name = "Buildings/StinkLines/stinky2" };
			public static ImageEntry stinky3 = new ImageEntry{ name = "Buildings/StinkLines/stinky3" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ stinky1, stinky2, stinky3 } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
	}
	public static class Clothes{
		public static class Hats{
			public static ImageEntry hat1 = new ImageEntry{ name = "Clothes/Hats/hat1" };
			public static ImageEntry hat10 = new ImageEntry{ name = "Clothes/Hats/hat10" };
			public static ImageEntry hat2 = new ImageEntry{ name = "Clothes/Hats/hat2" };
			public static ImageEntry hat3 = new ImageEntry{ name = "Clothes/Hats/hat3" };
			public static ImageEntry hat5 = new ImageEntry{ name = "Clothes/Hats/hat5" };
			public static ImageEntry hat6 = new ImageEntry{ name = "Clothes/Hats/hat6" };
			public static ImageEntry hat8 = new ImageEntry{ name = "Clothes/Hats/hat8" };
			public static ImageEntry hat9 = new ImageEntry{ name = "Clothes/Hats/hat9" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ hat1, hat10, hat2, hat3, hat5, hat6, hat8, hat9 } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
		public static class Pants{
			public static ImageEntry pants1 = new ImageEntry{ name = "Clothes/Pants/pants1" };
			public static ImageEntry pants2 = new ImageEntry{ name = "Clothes/Pants/pants2" };
			public static ImageEntry pants3 = new ImageEntry{ name = "Clothes/Pants/pants3" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ pants1, pants2, pants3 } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
		public static class Shirts{
			public static ImageEntry shirt1 = new ImageEntry{ name = "Clothes/Shirts/shirt1" };
			public static ImageEntry shirt2 = new ImageEntry{ name = "Clothes/Shirts/shirt2" };
			public static ImageEntry shirt3 = new ImageEntry{ name = "Clothes/Shirts/shirt3" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ shirt1, shirt2, shirt3 } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
		public static class Shoes{
			public static ImageEntry shoe1 = new ImageEntry{ name = "Clothes/Shoes/shoe1" };
			public static ImageEntry shoe2 = new ImageEntry{ name = "Clothes/Shoes/shoe2" };
			public static ImageEntry shoe3 = new ImageEntry{ name = "Clothes/Shoes/shoe3" };
			public static ImageEntry shoe4 = new ImageEntry{ name = "Clothes/Shoes/shoe4" };
			public static ImageEntry shoe5 = new ImageEntry{ name = "Clothes/Shoes/shoe5" };
			public static ImageEntry shoe6 = new ImageEntry{ name = "Clothes/Shoes/shoe6" };
			public static ImageEntry shoe7 = new ImageEntry{ name = "Clothes/Shoes/shoe7" };
			public static ImageEntry shoe8 = new ImageEntry{ name = "Clothes/Shoes/shoe8" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ shoe1, shoe2, shoe3, shoe4, shoe5, shoe6, shoe7, shoe8 } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
		public static class Socks{
			public static ImageEntry socks1 = new ImageEntry{ name = "Clothes/Socks/socks1" };
			public static ImageEntry socks2 = new ImageEntry{ name = "Clothes/Socks/socks2" };
			public static ImageEntry socks3 = new ImageEntry{ name = "Clothes/Socks/socks3" };
			public static ImageEntry socks4 = new ImageEntry{ name = "Clothes/Socks/socks4" };
			public static ImageEntry socks5 = new ImageEntry{ name = "Clothes/Socks/socks5" };
			public static ImageEntry socks6 = new ImageEntry{ name = "Clothes/Socks/socks6" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ socks1, socks2, socks3, socks4, socks5, socks6 } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
	}
	public static class Core{
		public static ImageEntry BasicSpriteObject = new ImageEntry{ name = "Core/BasicSpriteObject" };
		public static MaterialEntry Glow_Material = new MaterialEntry{ name = "Core/Glow Material" };
		public static ImageSet set = new ImageSet( new ImageEntry[]{ BasicSpriteObject } );
		public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
	}
	public static class Dishes{
		public static class Bowls{
			public static ImageEntry bowl1 = new ImageEntry{ name = "Dishes/Bowls/bowl1" };
			public static ImageEntry bowl2 = new ImageEntry{ name = "Dishes/Bowls/bowl2" };
			public static ImageEntry bowl3 = new ImageEntry{ name = "Dishes/Bowls/bowl3" };
			public static ImageEntry bowl4 = new ImageEntry{ name = "Dishes/Bowls/bowl4" };
			public static ImageEntry bowl5 = new ImageEntry{ name = "Dishes/Bowls/bowl5" };
			public static ImageEntry bowl6 = new ImageEntry{ name = "Dishes/Bowls/bowl6" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ bowl1, bowl2, bowl3, bowl4, bowl5, bowl6 } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
		public static class Cup{
			public static ImageEntry cup10 = new ImageEntry{ name = "Dishes/Cup/cup10" };
			public static ImageEntry cup11 = new ImageEntry{ name = "Dishes/Cup/cup11" };
			public static ImageEntry cup12 = new ImageEntry{ name = "Dishes/Cup/cup12" };
			public static ImageEntry cup2 = new ImageEntry{ name = "Dishes/Cup/cup2" };
			public static ImageEntry cup3 = new ImageEntry{ name = "Dishes/Cup/cup3" };
			public static ImageEntry cup4 = new ImageEntry{ name = "Dishes/Cup/cup4" };
			public static ImageEntry cup5 = new ImageEntry{ name = "Dishes/Cup/cup5" };
			public static ImageEntry cup6 = new ImageEntry{ name = "Dishes/Cup/cup6" };
			public static ImageEntry cup7 = new ImageEntry{ name = "Dishes/Cup/cup7" };
			public static ImageEntry cup8 = new ImageEntry{ name = "Dishes/Cup/cup8" };
			public static ImageEntry cup9 = new ImageEntry{ name = "Dishes/Cup/cup9" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ cup10, cup11, cup12, cup2, cup3, cup4, cup5, cup6, cup7, cup8, cup9 } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
		public static class Knives{
			public static ImageEntry knife1 = new ImageEntry{ name = "Dishes/Knives/knife1" };
			public static ImageEntry knife2 = new ImageEntry{ name = "Dishes/Knives/knife2" };
			public static ImageEntry knife3 = new ImageEntry{ name = "Dishes/Knives/knife3" };
			public static ImageEntry knife4 = new ImageEntry{ name = "Dishes/Knives/knife4" };
			public static ImageEntry knife5 = new ImageEntry{ name = "Dishes/Knives/knife5" };
			public static ImageEntry knife6 = new ImageEntry{ name = "Dishes/Knives/knife6" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ knife1, knife2, knife3, knife4, knife5, knife6 } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
		public static class Plates{
			public static ImageEntry plate1 = new ImageEntry{ name = "Dishes/Plates/plate1" };
			public static ImageEntry plate2 = new ImageEntry{ name = "Dishes/Plates/plate2" };
			public static ImageEntry plate3 = new ImageEntry{ name = "Dishes/Plates/plate3" };
			public static ImageEntry plate4 = new ImageEntry{ name = "Dishes/Plates/plate4" };
			public static ImageEntry plate5 = new ImageEntry{ name = "Dishes/Plates/plate5" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ plate1, plate2, plate3, plate4, plate5 } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
		public static class Spoons{
			public static ImageEntry spoon1 = new ImageEntry{ name = "Dishes/Spoons/spoon1" };
			public static ImageEntry spoon2 = new ImageEntry{ name = "Dishes/Spoons/spoon2" };
			public static ImageEntry spoon3 = new ImageEntry{ name = "Dishes/Spoons/spoon3" };
			public static ImageEntry spoon4 = new ImageEntry{ name = "Dishes/Spoons/spoon4" };
			public static ImageEntry spoon5 = new ImageEntry{ name = "Dishes/Spoons/spoon5" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ spoon1, spoon2, spoon3, spoon4, spoon5 } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
	}
	public static class doggame{
		public static ImageEntry dogbody = new ImageEntry{ name = "doggame/dogbody" };
		public static ImageEntry doghead = new ImageEntry{ name = "doggame/doghead" };
		public static ImageEntry doghouse = new ImageEntry{ name = "doggame/doghouse" };
		public static ImageEntry firehydrant = new ImageEntry{ name = "doggame/firehydrant" };
		public static ImageSet set = new ImageSet( new ImageEntry[]{ dogbody, doghead, doghouse, firehydrant } );
		public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		public static class bone{
			public static ImageEntry bone1 = new ImageEntry{ name = "doggame/bone/bone1" };
			public static ImageEntry bone2 = new ImageEntry{ name = "doggame/bone/bone2" };
			public static ImageEntry bone3 = new ImageEntry{ name = "doggame/bone/bone3" };
			public static ImageEntry bone4 = new ImageEntry{ name = "doggame/bone/bone4" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ bone1, bone2, bone3, bone4 } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
	}
	public static class doorgame{
		public static ImageEntry doorknob = new ImageEntry{ name = "doorgame/doorknob" };
		public static ImageEntry fence1a = new ImageEntry{ name = "doorgame/fence1a" };
		public static ImageEntry fence1b = new ImageEntry{ name = "doorgame/fence1b" };
		public static ImageEntry ladder1 = new ImageEntry{ name = "doorgame/ladder1" };
		public static ImageEntry opendoor = new ImageEntry{ name = "doorgame/opendoor" };
		public static ImageEntry vaulta = new ImageEntry{ name = "doorgame/vaulta" };
		public static ImageEntry vaultb = new ImageEntry{ name = "doorgame/vaultb" };
		public static ImageSet set = new ImageSet( new ImageEntry[]{ doorknob, fence1a, fence1b, ladder1, opendoor, vaulta, vaultb } );
		public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		public static class bigkey{
			public static ImageEntry bigkey1 = new ImageEntry{ name = "doorgame/bigkey/bigkey1" };
			public static ImageEntry bigkey2 = new ImageEntry{ name = "doorgame/bigkey/bigkey2" };
			public static ImageEntry bigkey3 = new ImageEntry{ name = "doorgame/bigkey/bigkey3" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ bigkey1, bigkey2, bigkey3 } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
		public static class carrot{
			public static ImageEntry carrot1 = new ImageEntry{ name = "doorgame/carrot/carrot1" };
			public static ImageEntry carrot2 = new ImageEntry{ name = "doorgame/carrot/carrot2" };
			public static ImageEntry carrot3 = new ImageEntry{ name = "doorgame/carrot/carrot3" };
			public static ImageEntry carrot4 = new ImageEntry{ name = "doorgame/carrot/carrot4" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ carrot1, carrot2, carrot3, carrot4 } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
		public static class door{
			public static ImageEntry door1a = new ImageEntry{ name = "doorgame/door/door1a" };
			public static ImageEntry door1b = new ImageEntry{ name = "doorgame/door/door1b" };
			public static ImageEntry door2a = new ImageEntry{ name = "doorgame/door/door2a" };
			public static ImageEntry door2b = new ImageEntry{ name = "doorgame/door/door2b" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ door1a, door1b, door2a, door2b } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
		public static class flower{
			public static ImageEntry flower1 = new ImageEntry{ name = "doorgame/flower/flower1" };
			public static ImageEntry flower2 = new ImageEntry{ name = "doorgame/flower/flower2" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ flower1, flower2 } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
		public static class hammer{
			public static ImageEntry hammer1 = new ImageEntry{ name = "doorgame/hammer/hammer1" };
			public static ImageEntry hammer2 = new ImageEntry{ name = "doorgame/hammer/hammer2" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ hammer1, hammer2 } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
		public static class heart{
			public static ImageEntry heart1 = new ImageEntry{ name = "doorgame/heart/heart1" };
			public static ImageEntry heart2 = new ImageEntry{ name = "doorgame/heart/heart2" };
			public static ImageEntry heart3 = new ImageEntry{ name = "doorgame/heart/heart3" };
			public static ImageEntry heart4 = new ImageEntry{ name = "doorgame/heart/heart4" };
			public static ImageEntry heart5 = new ImageEntry{ name = "doorgame/heart/heart5" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ heart1, heart2, heart3, heart4, heart5 } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
		public static class key{
			public static ImageEntry key1 = new ImageEntry{ name = "doorgame/key/key1" };
			public static ImageEntry key2 = new ImageEntry{ name = "doorgame/key/key2" };
			public static ImageEntry key3 = new ImageEntry{ name = "doorgame/key/key3" };
			public static ImageEntry key4 = new ImageEntry{ name = "doorgame/key/key4" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ key1, key2, key3, key4 } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
		public static class keyhole{
			public static ImageEntry keyhole1 = new ImageEntry{ name = "doorgame/keyhole/keyhole1" };
			public static ImageEntry keyhole2 = new ImageEntry{ name = "doorgame/keyhole/keyhole2" };
			public static ImageEntry keyhole3 = new ImageEntry{ name = "doorgame/keyhole/keyhole3" };
			public static ImageEntry keyhole4 = new ImageEntry{ name = "doorgame/keyhole/keyhole4" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ keyhole1, keyhole2, keyhole3, keyhole4 } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
		public static class moon{
			public static ImageEntry moon1 = new ImageEntry{ name = "doorgame/moon/moon1" };
			public static ImageEntry moon2 = new ImageEntry{ name = "doorgame/moon/moon2" };
			public static ImageEntry moon3 = new ImageEntry{ name = "doorgame/moon/moon3" };
			public static ImageEntry moon4 = new ImageEntry{ name = "doorgame/moon/moon4" };
			public static ImageEntry moon5 = new ImageEntry{ name = "doorgame/moon/moon5" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ moon1, moon2, moon3, moon4, moon5 } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
		public static class pumpkin{
			public static ImageEntry pumpkin1 = new ImageEntry{ name = "doorgame/pumpkin/pumpkin1" };
			public static ImageEntry pumpkin2 = new ImageEntry{ name = "doorgame/pumpkin/pumpkin2" };
			public static ImageEntry pumpkin3 = new ImageEntry{ name = "doorgame/pumpkin/pumpkin3" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ pumpkin1, pumpkin2, pumpkin3 } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
		public static class saw{
			public static ImageEntry saw1 = new ImageEntry{ name = "doorgame/saw/saw1" };
			public static ImageEntry saw2 = new ImageEntry{ name = "doorgame/saw/saw2" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ saw1, saw2 } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
		public static class sun{
			public static ImageEntry sun1 = new ImageEntry{ name = "doorgame/sun/sun1" };
			public static ImageEntry sun2 = new ImageEntry{ name = "doorgame/sun/sun2" };
			public static ImageEntry sun3 = new ImageEntry{ name = "doorgame/sun/sun3" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ sun1, sun2, sun3 } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
		public static class sunglasses{
			public static ImageEntry glasses1 = new ImageEntry{ name = "doorgame/sunglasses/glasses1" };
			public static ImageEntry glasses2 = new ImageEntry{ name = "doorgame/sunglasses/glasses2" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ glasses1, glasses2 } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
		public static class tree{
			public static ImageEntry tree1 = new ImageEntry{ name = "doorgame/tree/tree1" };
			public static ImageEntry tree2 = new ImageEntry{ name = "doorgame/tree/tree2" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ tree1, tree2 } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
		public static class window{
			public static ImageEntry window1a = new ImageEntry{ name = "doorgame/window/window1a" };
			public static ImageEntry window1b = new ImageEntry{ name = "doorgame/window/window1b" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ window1a, window1b } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
	}
	public static class Foes{
		public static ImageEntry foeCloudMustache = new ImageEntry{ name = "Foes/foeCloudMustache" };
		public static ImageEntry foeMicrowave = new ImageEntry{ name = "Foes/foeMicrowave" };
		public static ImageEntry foeMustache = new ImageEntry{ name = "Foes/foeMustache" };
		public static ImageEntry foePlantHead = new ImageEntry{ name = "Foes/foePlantHead" };
		public static ImageEntry foeTrash = new ImageEntry{ name = "Foes/foeTrash" };
		public static ImageSet set = new ImageSet( new ImageEntry[]{ foeCloudMustache, foeMicrowave, foeMustache, foePlantHead, foeTrash } );
		public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
	}
	public static class Music{
		public static SoundEntry GoSaS = new SoundEntry{ name = "Music/GoSaS" };
		public static SoundEntry somenes12 = new SoundEntry{ name = "Music/somenes12" };
		public static SoundEntry somenes19b = new SoundEntry{ name = "Music/somenes19b" };
		public static SoundEntry somenes20a = new SoundEntry{ name = "Music/somenes20a" };
		public static SoundEntry THEGRIM24a = new SoundEntry{ name = "Music/THEGRIM24a" };
		public static SoundEntry THEGRIM31a = new SoundEntry{ name = "Music/THEGRIM31a" };
		public static SoundSet snds = new SoundSet( new SoundEntry[]{ GoSaS, somenes12, somenes19b, somenes20a, THEGRIM24a, THEGRIM31a } );
		public static AudioClip rand(){ return snds.files[Random.Range(0, snds.files.Length)].snd; }
	}
	public static class old{
		public static class aliens{
			public static ImageEntry alienidle = new ImageEntry{ name = "old/aliens/alienidle" };
			public static ImageEntry smallalien = new ImageEntry{ name = "old/aliens/smallalien" };
			public static ImageEntry smallalien1 = new ImageEntry{ name = "old/aliens/smallalien1" };
			public static ImageEntry smallalien2 = new ImageEntry{ name = "old/aliens/smallalien2" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ alienidle, smallalien, smallalien1, smallalien2 } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
		public static class birds{
			public static ImageEntry birdhead = new ImageEntry{ name = "old/birds/birdhead" };
			public static ImageEntry birdwithshirt = new ImageEntry{ name = "old/birds/birdwithshirt" };
			public static ImageEntry jauntybird = new ImageEntry{ name = "old/birds/jauntybird" };
			public static ImageEntry penguin = new ImageEntry{ name = "old/birds/penguin" };
			public static ImageEntry wanderingbird = new ImageEntry{ name = "old/birds/wanderingbird" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ birdhead, birdwithshirt, jauntybird, penguin, wanderingbird } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
		public static class buildings{
			public static ImageEntry house = new ImageEntry{ name = "old/buildings/house" };
			public static ImageEntry igloo = new ImageEntry{ name = "old/buildings/igloo" };
			public static ImageEntry igloo2 = new ImageEntry{ name = "old/buildings/igloo2" };
			public static ImageEntry igloo3 = new ImageEntry{ name = "old/buildings/igloo3" };
			public static ImageEntry longhouse = new ImageEntry{ name = "old/buildings/longhouse" };
			public static ImageEntry outhouse = new ImageEntry{ name = "old/buildings/outhouse" };
			public static ImageEntry pigbillboard = new ImageEntry{ name = "old/buildings/pigbillboard" };
			public static ImageEntry tent = new ImageEntry{ name = "old/buildings/tent" };
			public static ImageEntry watersurface = new ImageEntry{ name = "old/buildings/watersurface" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ house, igloo, igloo2, igloo3, longhouse, outhouse, pigbillboard, tent, watersurface } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
		public static class clocks{
			public static ImageEntry clock = new ImageEntry{ name = "old/clocks/clock" };
			public static ImageEntry clock2 = new ImageEntry{ name = "old/clocks/clock2" };
			public static ImageEntry digitalclock = new ImageEntry{ name = "old/clocks/digitalclock" };
			public static ImageEntry grandfatherclock = new ImageEntry{ name = "old/clocks/grandfatherclock" };
			public static ImageEntry watch = new ImageEntry{ name = "old/clocks/watch" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ clock, clock2, digitalclock, grandfatherclock, watch } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
		public static class clothes{
			public static ImageEntry falseteeth = new ImageEntry{ name = "old/clothes/falseteeth" };
			public static ImageEntry glasses = new ImageEntry{ name = "old/clothes/glasses" };
			public static ImageEntry shield = new ImageEntry{ name = "old/clothes/shield" };
			public static ImageEntry shoe = new ImageEntry{ name = "old/clothes/shoe" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ falseteeth, glasses, shield, shoe } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
		public static class critters{
			public static ImageEntry fish = new ImageEntry{ name = "old/critters/fish" };
			public static ImageEntry littlefish = new ImageEntry{ name = "old/critters/littlefish" };
			public static ImageEntry saddlepig = new ImageEntry{ name = "old/critters/saddlepig" };
			public static ImageEntry tadpole = new ImageEntry{ name = "old/critters/tadpole" };
			public static ImageEntry workerbee = new ImageEntry{ name = "old/critters/workerbee" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ fish, littlefish, saddlepig, tadpole, workerbee } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
		public static class dangerous{
			public static ImageEntry chemicals = new ImageEntry{ name = "old/dangerous/chemicals" };
			public static ImageEntry chemicals2 = new ImageEntry{ name = "old/dangerous/chemicals2" };
			public static ImageEntry chemicals3 = new ImageEntry{ name = "old/dangerous/chemicals3" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ chemicals, chemicals2, chemicals3 } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
		public static class dishes{
			public static ImageEntry bottle2 = new ImageEntry{ name = "old/dishes/bottle2" };
			public static ImageEntry cup = new ImageEntry{ name = "old/dishes/cup" };
			public static ImageEntry emptybottle = new ImageEntry{ name = "old/dishes/emptybottle" };
			public static ImageEntry emptycup = new ImageEntry{ name = "old/dishes/emptycup" };
			public static ImageEntry fokr1 = new ImageEntry{ name = "old/dishes/fokr1" };
			public static ImageEntry fork1 = new ImageEntry{ name = "old/dishes/fork1" };
			public static ImageEntry fork1a = new ImageEntry{ name = "old/dishes/fork1a" };
			public static ImageEntry fork2 = new ImageEntry{ name = "old/dishes/fork2" };
			public static ImageEntry fork2a = new ImageEntry{ name = "old/dishes/fork2a" };
			public static ImageEntry fork3 = new ImageEntry{ name = "old/dishes/fork3" };
			public static ImageEntry mug = new ImageEntry{ name = "old/dishes/mug" };
			public static ImageEntry mugb = new ImageEntry{ name = "old/dishes/mugb" };
			public static ImageEntry spoon1 = new ImageEntry{ name = "old/dishes/spoon1" };
			public static ImageEntry spoon1a = new ImageEntry{ name = "old/dishes/spoon1a" };
			public static ImageEntry spoon2 = new ImageEntry{ name = "old/dishes/spoon2" };
			public static ImageEntry spoon2a = new ImageEntry{ name = "old/dishes/spoon2a" };
			public static ImageEntry spoon3 = new ImageEntry{ name = "old/dishes/spoon3" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ bottle2, cup, emptybottle, emptycup, fokr1, fork1, fork1a, fork2, fork2a, fork3, mug, mugb, spoon1, spoon1a, spoon2, spoon2a, spoon3 } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
		public static class doors{
			public static ImageEntry door1 = new ImageEntry{ name = "old/doors/door1" };
			public static ImageEntry door2 = new ImageEntry{ name = "old/doors/door2" };
			public static ImageEntry door3 = new ImageEntry{ name = "old/doors/door3" };
			public static ImageEntry door4 = new ImageEntry{ name = "old/doors/door4" };
			public static ImageEntry door5 = new ImageEntry{ name = "old/doors/door5" };
			public static ImageEntry doora = new ImageEntry{ name = "old/doors/doora" };
			public static ImageEntry doorb = new ImageEntry{ name = "old/doors/doorb" };
			public static ImageEntry doorc = new ImageEntry{ name = "old/doors/doorc" };
			public static ImageEntry elevator = new ImageEntry{ name = "old/doors/elevator" };
			public static ImageEntry key1 = new ImageEntry{ name = "old/doors/key1" };
			public static ImageEntry key2 = new ImageEntry{ name = "old/doors/key2" };
			public static ImageEntry keyhole1 = new ImageEntry{ name = "old/doors/keyhole1" };
			public static ImageEntry keyhole2 = new ImageEntry{ name = "old/doors/keyhole2" };
			public static ImageEntry opendoor = new ImageEntry{ name = "old/doors/opendoor" };
			public static ImageEntry opendoor2 = new ImageEntry{ name = "old/doors/opendoor2" };
			public static ImageEntry opendoor3 = new ImageEntry{ name = "old/doors/opendoor3" };
			public static ImageEntry opendoora = new ImageEntry{ name = "old/doors/opendoora" };
			public static ImageEntry padlock = new ImageEntry{ name = "old/doors/padlock" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ door1, door2, door3, door4, door5, doora, doorb, doorc, elevator, key1, key2, keyhole1, keyhole2, opendoor, opendoor2, opendoor3, opendoora, padlock } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
		public static class food{
			public static ImageEntry apple1 = new ImageEntry{ name = "old/food/apple1" };
			public static ImageEntry apple2 = new ImageEntry{ name = "old/food/apple2" };
			public static ImageEntry bigturkey = new ImageEntry{ name = "old/food/bigturkey" };
			public static ImageEntry bigturkeya = new ImageEntry{ name = "old/food/bigturkeya" };
			public static ImageEntry burger = new ImageEntry{ name = "old/food/burger" };
			public static ImageEntry carrot1 = new ImageEntry{ name = "old/food/carrot1" };
			public static ImageEntry carrot2 = new ImageEntry{ name = "old/food/carrot2" };
			public static ImageEntry cherry1 = new ImageEntry{ name = "old/food/cherry1" };
			public static ImageEntry cherry2 = new ImageEntry{ name = "old/food/cherry2" };
			public static ImageEntry fries = new ImageEntry{ name = "old/food/fries" };
			public static ImageEntry friesa = new ImageEntry{ name = "old/food/friesa" };
			public static ImageEntry hamburger = new ImageEntry{ name = "old/food/hamburger" };
			public static ImageEntry icecreamcone = new ImageEntry{ name = "old/food/icecreamcone" };
			public static ImageEntry milkshake = new ImageEntry{ name = "old/food/milkshake" };
			public static ImageEntry orange = new ImageEntry{ name = "old/food/orange" };
			public static ImageEntry smellytaco = new ImageEntry{ name = "old/food/smellytaco" };
			public static ImageEntry taco = new ImageEntry{ name = "old/food/taco" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ apple1, apple2, bigturkey, bigturkeya, burger, carrot1, carrot2, cherry1, cherry2, fries, friesa, hamburger, icecreamcone, milkshake, orange, smellytaco, taco } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
		public static class guys{
			public static ImageEntry bellyhatguy = new ImageEntry{ name = "old/guys/bellyhatguy" };
			public static ImageEntry bighobo = new ImageEntry{ name = "old/guys/bighobo" };
			public static ImageEntry dancingnaked = new ImageEntry{ name = "old/guys/dancingnaked" };
			public static ImageEntry deerman = new ImageEntry{ name = "old/guys/deerman" };
			public static ImageEntry dopeyguy = new ImageEntry{ name = "old/guys/dopeyguy" };
			public static ImageEntry flyingguy = new ImageEntry{ name = "old/guys/flyingguy" };
			public static ImageEntry hunchedrobedman = new ImageEntry{ name = "old/guys/hunchedrobedman" };
			public static ImageEntry jauntybody = new ImageEntry{ name = "old/guys/jauntybody" };
			public static ImageEntry jumpingdevil = new ImageEntry{ name = "old/guys/jumpingdevil" };
			public static ImageEntry leaninglincoln = new ImageEntry{ name = "old/guys/leaninglincoln" };
			public static ImageEntry leapinggunlincoln = new ImageEntry{ name = "old/guys/leapinggunlincoln" };
			public static ImageEntry mughatman = new ImageEntry{ name = "old/guys/mughatman" };
			public static ImageEntry shirtlessman = new ImageEntry{ name = "old/guys/shirtlessman" };
			public static ImageEntry stompingstickman = new ImageEntry{ name = "old/guys/stompingstickman" };
			public static ImageEntry thinscientist = new ImageEntry{ name = "old/guys/thinscientist" };
			public static ImageEntry tongueguy = new ImageEntry{ name = "old/guys/tongueguy" };
			public static ImageEntry trianglebluejay = new ImageEntry{ name = "old/guys/trianglebluejay" };
			public static ImageEntry weirddevilhornguy = new ImageEntry{ name = "old/guys/weirddevilhornguy" };
			public static ImageEntry wizard = new ImageEntry{ name = "old/guys/wizard" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ bellyhatguy, bighobo, dancingnaked, deerman, dopeyguy, flyingguy, hunchedrobedman, jauntybody, jumpingdevil, leaninglincoln, leapinggunlincoln, mughatman, shirtlessman, stompingstickman, thinscientist, tongueguy, trianglebluejay, weirddevilhornguy, wizard } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
		public static class hats{
			public static ImageEntry crookedhat = new ImageEntry{ name = "old/hats/crookedhat" };
			public static ImageEntry fez = new ImageEntry{ name = "old/hats/fez" };
			public static ImageEntry knighthelment = new ImageEntry{ name = "old/hats/knighthelment" };
			public static ImageEntry knighthelmet = new ImageEntry{ name = "old/hats/knighthelmet" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ crookedhat, fez, knighthelment, knighthelmet } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
		public static class heads{
			public static ImageEntry blockhead1 = new ImageEntry{ name = "old/heads/blockhead1" };
			public static ImageEntry blockhead2 = new ImageEntry{ name = "old/heads/blockhead2" };
			public static ImageEntry bughead = new ImageEntry{ name = "old/heads/bughead" };
			public static ImageEntry cheerfulstonehead = new ImageEntry{ name = "old/heads/cheerfulstonehead" };
			public static ImageEntry confusedcat = new ImageEntry{ name = "old/heads/confusedcat" };
			public static ImageEntry eye = new ImageEntry{ name = "old/heads/eye" };
			public static ImageEntry funnyface = new ImageEntry{ name = "old/heads/funnyface" };
			public static ImageEntry happyhead = new ImageEntry{ name = "old/heads/happyhead" };
			public static ImageEntry head1 = new ImageEntry{ name = "old/heads/head1" };
			public static ImageEntry head2 = new ImageEntry{ name = "old/heads/head2" };
			public static ImageEntry head3 = new ImageEntry{ name = "old/heads/head3" };
			public static ImageEntry head4 = new ImageEntry{ name = "old/heads/head4" };
			public static ImageEntry littlehead1 = new ImageEntry{ name = "old/heads/littlehead1" };
			public static ImageEntry littlehead2 = new ImageEntry{ name = "old/heads/littlehead2" };
			public static ImageEntry littlehead3 = new ImageEntry{ name = "old/heads/littlehead3" };
			public static ImageEntry littlehead4 = new ImageEntry{ name = "old/heads/littlehead4" };
			public static ImageEntry littlehead5 = new ImageEntry{ name = "old/heads/littlehead5" };
			public static ImageEntry littlehead6 = new ImageEntry{ name = "old/heads/littlehead6" };
			public static ImageEntry perplexedcat = new ImageEntry{ name = "old/heads/perplexedcat" };
			public static ImageEntry raggedhairface = new ImageEntry{ name = "old/heads/raggedhairface" };
			public static ImageEntry scarymask = new ImageEntry{ name = "old/heads/scarymask" };
			public static ImageEntry scowlinghead = new ImageEntry{ name = "old/heads/scowlinghead" };
			public static ImageEntry vacanteyemask = new ImageEntry{ name = "old/heads/vacanteyemask" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ blockhead1, blockhead2, bughead, cheerfulstonehead, confusedcat, eye, funnyface, happyhead, head1, head2, head3, head4, littlehead1, littlehead2, littlehead3, littlehead4, littlehead5, littlehead6, perplexedcat, raggedhairface, scarymask, scowlinghead, vacanteyemask } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
		public static class landprops{
			public static ImageEntry littletree = new ImageEntry{ name = "old/landprops/littletree" };
			public static ImageEntry volcano = new ImageEntry{ name = "old/landprops/volcano" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ littletree, volcano } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
		public static class skythings{
			public static ImageEntry cloud1 = new ImageEntry{ name = "old/skythings/cloud1" };
			public static ImageEntry cloud2 = new ImageEntry{ name = "old/skythings/cloud2" };
			public static ImageEntry cloud3 = new ImageEntry{ name = "old/skythings/cloud3" };
			public static ImageEntry clouda = new ImageEntry{ name = "old/skythings/clouda" };
			public static ImageEntry cloudb = new ImageEntry{ name = "old/skythings/cloudb" };
			public static ImageEntry cloudc = new ImageEntry{ name = "old/skythings/cloudc" };
			public static ImageEntry cloudd = new ImageEntry{ name = "old/skythings/cloudd" };
			public static ImageEntry cloudguy = new ImageEntry{ name = "old/skythings/cloudguy" };
			public static ImageEntry risingsunegg = new ImageEntry{ name = "old/skythings/risingsunegg" };
			public static ImageEntry suna = new ImageEntry{ name = "old/skythings/suna" };
			public static ImageEntry sunegg = new ImageEntry{ name = "old/skythings/sunegg" };
			public static ImageEntry sunrise1 = new ImageEntry{ name = "old/skythings/sunrise1" };
			public static ImageEntry sunrise2 = new ImageEntry{ name = "old/skythings/sunrise2" };
			public static ImageEntry sunrise3 = new ImageEntry{ name = "old/skythings/sunrise3" };
			public static ImageEntry sunwithmustache = new ImageEntry{ name = "old/skythings/sunwithmustache" };
			public static ImageEntry weirdcloud1 = new ImageEntry{ name = "old/skythings/weirdcloud1" };
			public static ImageEntry weirdcloud2 = new ImageEntry{ name = "old/skythings/weirdcloud2" };
			public static ImageEntry weirdcloud3 = new ImageEntry{ name = "old/skythings/weirdcloud3" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ cloud1, cloud2, cloud3, clouda, cloudb, cloudc, cloudd, cloudguy, risingsunegg, suna, sunegg, sunrise1, sunrise2, sunrise3, sunwithmustache, weirdcloud1, weirdcloud2, weirdcloud3 } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
		public static class sports{
			public static ImageEntry baseball = new ImageEntry{ name = "old/sports/baseball" };
			public static ImageEntry baseballbat = new ImageEntry{ name = "old/sports/baseballbat" };
			public static ImageEntry tennisball = new ImageEntry{ name = "old/sports/tennisball" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ baseball, baseballbat, tennisball } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
		public static class tools{
			public static ImageEntry broom = new ImageEntry{ name = "old/tools/broom" };
			public static ImageEntry computer = new ImageEntry{ name = "old/tools/computer" };
			public static ImageEntry hammer1 = new ImageEntry{ name = "old/tools/hammer1" };
			public static ImageEntry hammer2 = new ImageEntry{ name = "old/tools/hammer2" };
			public static ImageEntry scissors1 = new ImageEntry{ name = "old/tools/scissors1" };
			public static ImageEntry scissors2 = new ImageEntry{ name = "old/tools/scissors2" };
			public static ImageEntry teakettle = new ImageEntry{ name = "old/tools/teakettle" };
			public static ImageEntry toothbrush = new ImageEntry{ name = "old/tools/toothbrush" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ broom, computer, hammer1, hammer2, scissors1, scissors2, teakettle, toothbrush } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
		public static class vehicles{
			public static ImageEntry _18wheeltruck = new ImageEntry{ name = "old/vehicles/18wheeltruck" };
			public static ImageEntry airplane = new ImageEntry{ name = "old/vehicles/airplane" };
			public static ImageEntry bicycle = new ImageEntry{ name = "old/vehicles/bicycle" };
			public static ImageEntry helicopter = new ImageEntry{ name = "old/vehicles/helicopter" };
			public static ImageEntry liltruck = new ImageEntry{ name = "old/vehicles/liltruck" };
			public static ImageEntry spaceship = new ImageEntry{ name = "old/vehicles/spaceship" };
			public static ImageEntry stouttruck = new ImageEntry{ name = "old/vehicles/stouttruck" };
			public static ImageEntry tank = new ImageEntry{ name = "old/vehicles/tank" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ _18wheeltruck, airplane, bicycle, helicopter, liltruck, spaceship, stouttruck, tank } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
		public static class weapons{
			public static ImageEntry arrow1 = new ImageEntry{ name = "old/weapons/arrow1" };
			public static ImageEntry arrow2 = new ImageEntry{ name = "old/weapons/arrow2" };
			public static ImageEntry arrow3 = new ImageEntry{ name = "old/weapons/arrow3" };
			public static ImageEntry arrow4 = new ImageEntry{ name = "old/weapons/arrow4" };
			public static ImageEntry arrow5 = new ImageEntry{ name = "old/weapons/arrow5" };
			public static ImageEntry arrow6 = new ImageEntry{ name = "old/weapons/arrow6" };
			public static ImageEntry bomb = new ImageEntry{ name = "old/weapons/bomb" };
			public static ImageEntry dagger = new ImageEntry{ name = "old/weapons/dagger" };
			public static ImageEntry dart = new ImageEntry{ name = "old/weapons/dart" };
			public static ImageEntry rocket1 = new ImageEntry{ name = "old/weapons/rocket1" };
			public static ImageEntry rocket2 = new ImageEntry{ name = "old/weapons/rocket2" };
			public static ImageEntry rocket3 = new ImageEntry{ name = "old/weapons/rocket3" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ arrow1, arrow2, arrow3, arrow4, arrow5, arrow6, bomb, dagger, dart, rocket1, rocket2, rocket3 } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
	}
	public static class Overlays{
		public static ImageEntry screenlight = new ImageEntry{ name = "Overlays/screenlight" };
		public static ImageSet set = new ImageSet( new ImageEntry[]{ screenlight } );
		public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
	}
	public static class Players{
		public static ImageEntry angel = new ImageEntry{ name = "Players/angel" };
		public static ImageEntry angelpurple = new ImageEntry{ name = "Players/angelpurple" };
		public static ImageEntry angelyellow = new ImageEntry{ name = "Players/angelyellow" };
		public static ImageEntry flag1 = new ImageEntry{ name = "Players/flag1" };
		public static ImageEntry flag2 = new ImageEntry{ name = "Players/flag2" };
		public static ImageEntry girl1b_copy = new ImageEntry{ name = "Players/girl1b copy" };
		public static ImageEntry girl1cheer_copy_b = new ImageEntry{ name = "Players/girl1cheer copy b" };
		public static ImageEntry girl1cheer_copy_c = new ImageEntry{ name = "Players/girl1cheer copy c" };
		public static ImageEntry girlpurple = new ImageEntry{ name = "Players/girlpurple" };
		public static ImageEntry girlpurpleglow = new ImageEntry{ name = "Players/girlpurpleglow" };
		public static ImageEntry girlyellow = new ImageEntry{ name = "Players/girlyellow" };
		public static ImageEntry girlyellowglow = new ImageEntry{ name = "Players/girlyellowglow" };
		public static ImageEntry guy1cheer_copy = new ImageEntry{ name = "Players/guy1cheer copy" };
		public static ImageEntry guy1cheerb = new ImageEntry{ name = "Players/guy1cheerb" };
		public static ImageEntry guy1cheerd = new ImageEntry{ name = "Players/guy1cheerd" };
		public static ImageEntry guy2b_copy = new ImageEntry{ name = "Players/guy2b copy" };
		public static ImageEntry guy2c = new ImageEntry{ name = "Players/guy2c" };
		public static ImageEntry guy2d = new ImageEntry{ name = "Players/guy2d" };
		public static ImageSet set = new ImageSet( new ImageEntry[]{ angel, angelpurple, angelyellow, flag1, flag2, girl1b_copy, girl1cheer_copy_b, girl1cheer_copy_c, girlpurple, girlpurpleglow, girlyellow, girlyellowglow, guy1cheer_copy, guy1cheerb, guy1cheerd, guy2b_copy, guy2c, guy2d } );
		public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		public static class actions{
			public static ImageEntry accept = new ImageEntry{ name = "Players/actions/accept" };
			public static ImageEntry activate = new ImageEntry{ name = "Players/actions/activate" };
			public static ImageEntry assist = new ImageEntry{ name = "Players/actions/assist" };
			public static ImageEntry bag1 = new ImageEntry{ name = "Players/actions/bag1" };
			public static ImageEntry bag2 = new ImageEntry{ name = "Players/actions/bag2" };
			public static ImageEntry bag3 = new ImageEntry{ name = "Players/actions/bag3" };
			public static ImageEntry build = new ImageEntry{ name = "Players/actions/build" };
			public static ImageEntry defend = new ImageEntry{ name = "Players/actions/defend" };
			public static ImageEntry harvest = new ImageEntry{ name = "Players/actions/harvest" };
			public static ImageEntry heal = new ImageEntry{ name = "Players/actions/heal" };
			public static ImageEntry recklessability = new ImageEntry{ name = "Players/actions/recklessability" };
			public static ImageEntry redo = new ImageEntry{ name = "Players/actions/redo" };
			public static ImageEntry slash = new ImageEntry{ name = "Players/actions/slash" };
			public static ImageEntry strikeback = new ImageEntry{ name = "Players/actions/strikeback" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ accept, activate, assist, bag1, bag2, bag3, build, defend, harvest, heal, recklessability, redo, slash, strikeback } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
		public static class anims{
			public static ImageEntry bigslash1 = new ImageEntry{ name = "Players/anims/bigslash1" };
			public static ImageEntry bigslash2 = new ImageEntry{ name = "Players/anims/bigslash2" };
			public static ImageEntry build1 = new ImageEntry{ name = "Players/anims/build1" };
			public static ImageEntry build2 = new ImageEntry{ name = "Players/anims/build2" };
			public static ImageEntry defend1 = new ImageEntry{ name = "Players/anims/defend1" };
			public static ImageEntry defend2 = new ImageEntry{ name = "Players/anims/defend2" };
			public static ImageEntry dig1 = new ImageEntry{ name = "Players/anims/dig1" };
			public static ImageEntry dig2 = new ImageEntry{ name = "Players/anims/dig2" };
			public static ImageEntry help1 = new ImageEntry{ name = "Players/anims/help1" };
			public static ImageEntry help2 = new ImageEntry{ name = "Players/anims/help2" };
			public static ImageEntry item1 = new ImageEntry{ name = "Players/anims/item1" };
			public static ImageEntry item2 = new ImageEntry{ name = "Players/anims/item2" };
			public static ImageEntry jump1 = new ImageEntry{ name = "Players/anims/jump1" };
			public static ImageEntry jump2 = new ImageEntry{ name = "Players/anims/jump2" };
			public static ImageEntry retalitate1 = new ImageEntry{ name = "Players/anims/retalitate1" };
			public static ImageEntry shock1 = new ImageEntry{ name = "Players/anims/shock1" };
			public static ImageEntry shock2 = new ImageEntry{ name = "Players/anims/shock2" };
			public static ImageEntry sit1 = new ImageEntry{ name = "Players/anims/sit1" };
			public static ImageEntry sit2 = new ImageEntry{ name = "Players/anims/sit2" };
			public static ImageEntry smallslash1 = new ImageEntry{ name = "Players/anims/smallslash1" };
			public static ImageEntry smallslash2 = new ImageEntry{ name = "Players/anims/smallslash2" };
			public static ImageEntry walk1 = new ImageEntry{ name = "Players/anims/walk1" };
			public static ImageEntry walk2 = new ImageEntry{ name = "Players/anims/walk2" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ bigslash1, bigslash2, build1, build2, defend1, defend2, dig1, dig2, help1, help2, item1, item2, jump1, jump2, retalitate1, shock1, shock2, sit1, sit2, smallslash1, smallslash2, walk1, walk2 } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
		public static class buildingabilities{
			public static ImageEntry biplane = new ImageEntry{ name = "Players/buildingabilities/biplane" };
			public static ImageEntry blimp = new ImageEntry{ name = "Players/buildingabilities/blimp" };
			public static ImageEntry broccoli = new ImageEntry{ name = "Players/buildingabilities/broccoli" };
			public static ImageEntry cow = new ImageEntry{ name = "Players/buildingabilities/cow" };
			public static ImageEntry fairyability = new ImageEntry{ name = "Players/buildingabilities/fairyability" };
			public static ImageEntry fish = new ImageEntry{ name = "Players/buildingabilities/fish" };
			public static ImageEntry flowers = new ImageEntry{ name = "Players/buildingabilities/flowers" };
			public static ImageEntry meds = new ImageEntry{ name = "Players/buildingabilities/meds" };
			public static ImageEntry policecar = new ImageEntry{ name = "Players/buildingabilities/policecar" };
			public static ImageEntry policecopter = new ImageEntry{ name = "Players/buildingabilities/policecopter" };
			public static ImageEntry sun = new ImageEntry{ name = "Players/buildingabilities/sun" };
			public static ImageEntry turtles = new ImageEntry{ name = "Players/buildingabilities/turtles" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ biplane, blimp, broccoli, cow, fairyability, fish, flowers, meds, policecar, policecopter, sun, turtles } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
		public static class heads{
			public static ImageEntry head1 = new ImageEntry{ name = "Players/heads/head1" };
			public static ImageEntry head10 = new ImageEntry{ name = "Players/heads/head10" };
			public static ImageEntry head11 = new ImageEntry{ name = "Players/heads/head11" };
			public static ImageEntry head12 = new ImageEntry{ name = "Players/heads/head12" };
			public static ImageEntry head13 = new ImageEntry{ name = "Players/heads/head13" };
			public static ImageEntry head14 = new ImageEntry{ name = "Players/heads/head14" };
			public static ImageEntry head15 = new ImageEntry{ name = "Players/heads/head15" };
			public static ImageEntry head16 = new ImageEntry{ name = "Players/heads/head16" };
			public static ImageEntry head17 = new ImageEntry{ name = "Players/heads/head17" };
			public static ImageEntry head18 = new ImageEntry{ name = "Players/heads/head18" };
			public static ImageEntry head19 = new ImageEntry{ name = "Players/heads/head19" };
			public static ImageEntry head2 = new ImageEntry{ name = "Players/heads/head2" };
			public static ImageEntry head20 = new ImageEntry{ name = "Players/heads/head20" };
			public static ImageEntry head3 = new ImageEntry{ name = "Players/heads/head3" };
			public static ImageEntry head4 = new ImageEntry{ name = "Players/heads/head4" };
			public static ImageEntry head5 = new ImageEntry{ name = "Players/heads/head5" };
			public static ImageEntry head6 = new ImageEntry{ name = "Players/heads/head6" };
			public static ImageEntry head7 = new ImageEntry{ name = "Players/heads/head7" };
			public static ImageEntry head8 = new ImageEntry{ name = "Players/heads/head8" };
			public static ImageEntry head9 = new ImageEntry{ name = "Players/heads/head9" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ head1, head10, head11, head12, head13, head14, head15, head16, head17, head18, head19, head2, head20, head3, head4, head5, head6, head7, head8, head9 } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
		public static class items{
			public static ImageEntry ball = new ImageEntry{ name = "Players/items/ball" };
			public static ImageEntry baseballbat = new ImageEntry{ name = "Players/items/baseballbat" };
			public static ImageEntry bomb = new ImageEntry{ name = "Players/items/bomb" };
			public static ImageEntry broom = new ImageEntry{ name = "Players/items/broom" };
			public static ImageEntry clock = new ImageEntry{ name = "Players/items/clock" };
			public static ImageEntry computer = new ImageEntry{ name = "Players/items/computer" };
			public static ImageEntry hammer = new ImageEntry{ name = "Players/items/hammer" };
			public static ImageEntry helmet = new ImageEntry{ name = "Players/items/helmet" };
			public static ImageEntry mask = new ImageEntry{ name = "Players/items/mask" };
			public static ImageEntry mask2 = new ImageEntry{ name = "Players/items/mask2" };
			public static ImageEntry rocket = new ImageEntry{ name = "Players/items/rocket" };
			public static ImageEntry scissors = new ImageEntry{ name = "Players/items/scissors" };
			public static ImageEntry shield = new ImageEntry{ name = "Players/items/shield" };
			public static ImageEntry teeth = new ImageEntry{ name = "Players/items/teeth" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ ball, baseballbat, bomb, broom, clock, computer, hammer, helmet, mask, mask2, rocket, scissors, shield, teeth } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
		public static class itemsFull{
			public static ImageEntry baseballbat = new ImageEntry{ name = "Players/itemsFull/baseballbat" };
			public static ImageEntry bomb = new ImageEntry{ name = "Players/itemsFull/bomb" };
			public static ImageEntry broom = new ImageEntry{ name = "Players/itemsFull/broom" };
			public static ImageEntry clock = new ImageEntry{ name = "Players/itemsFull/clock" };
			public static ImageEntry computer = new ImageEntry{ name = "Players/itemsFull/computer" };
			public static ImageEntry falseteeth = new ImageEntry{ name = "Players/itemsFull/falseteeth" };
			public static ImageEntry hammer2 = new ImageEntry{ name = "Players/itemsFull/hammer2" };
			public static ImageEntry knighthelment = new ImageEntry{ name = "Players/itemsFull/knighthelment" };
			public static ImageEntry rocket2 = new ImageEntry{ name = "Players/itemsFull/rocket2" };
			public static ImageEntry scarymask = new ImageEntry{ name = "Players/itemsFull/scarymask" };
			public static ImageEntry scissors1 = new ImageEntry{ name = "Players/itemsFull/scissors1" };
			public static ImageEntry scissors2 = new ImageEntry{ name = "Players/itemsFull/scissors2" };
			public static ImageEntry shield = new ImageEntry{ name = "Players/itemsFull/shield" };
			public static ImageEntry tennisball = new ImageEntry{ name = "Players/itemsFull/tennisball" };
			public static ImageEntry vacanteyemask = new ImageEntry{ name = "Players/itemsFull/vacanteyemask" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ baseballbat, bomb, broom, clock, computer, falseteeth, hammer2, knighthelment, rocket2, scarymask, scissors1, scissors2, shield, tennisball, vacanteyemask } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
		public static class resources{
			public static ImageEntry beer = new ImageEntry{ name = "Players/resources/beer" };
			public static ImageEntry burger = new ImageEntry{ name = "Players/resources/burger" };
			public static ImageEntry canofbeans = new ImageEntry{ name = "Players/resources/canofbeans" };
			public static ImageEntry chemicals = new ImageEntry{ name = "Players/resources/chemicals" };
			public static ImageEntry chemicals2 = new ImageEntry{ name = "Players/resources/chemicals2" };
			public static ImageEntry corn = new ImageEntry{ name = "Players/resources/corn" };
			public static ImageEntry dollar2 = new ImageEntry{ name = "Players/resources/dollar2" };
			public static ImageEntry fries = new ImageEntry{ name = "Players/resources/fries" };
			public static ImageEntry taco1 = new ImageEntry{ name = "Players/resources/taco1" };
			public static ImageEntry tbone_steak = new ImageEntry{ name = "Players/resources/tbone_steak" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ beer, burger, canofbeans, chemicals, chemicals2, corn, dollar2, fries, taco1, tbone_steak } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
	}
	public static class Props{
		public static class Boulders{
			public static ImageEntry boulder_copy_a = new ImageEntry{ name = "Props/Boulders/boulder copy a" };
			public static ImageEntry Boulder1 = new ImageEntry{ name = "Props/Boulders/Boulder1" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ boulder_copy_a, Boulder1 } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
		public static class Buildings{
			public static ImageEntry building1 = new ImageEntry{ name = "Props/Buildings/building1" };
			public static ImageEntry building10 = new ImageEntry{ name = "Props/Buildings/building10" };
			public static ImageEntry building2 = new ImageEntry{ name = "Props/Buildings/building2" };
			public static ImageEntry building3 = new ImageEntry{ name = "Props/Buildings/building3" };
			public static ImageEntry building4 = new ImageEntry{ name = "Props/Buildings/building4" };
			public static ImageEntry building5 = new ImageEntry{ name = "Props/Buildings/building5" };
			public static ImageEntry building6 = new ImageEntry{ name = "Props/Buildings/building6" };
			public static ImageEntry building7 = new ImageEntry{ name = "Props/Buildings/building7" };
			public static ImageEntry building8 = new ImageEntry{ name = "Props/Buildings/building8" };
			public static ImageEntry building9 = new ImageEntry{ name = "Props/Buildings/building9" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ building1, building10, building2, building3, building4, building5, building6, building7, building8, building9 } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
		public static class Bushes{
			public static ImageEntry bushes1 = new ImageEntry{ name = "Props/Bushes/bushes1" };
			public static ImageEntry bushes2 = new ImageEntry{ name = "Props/Bushes/bushes2" };
			public static ImageEntry bushes3 = new ImageEntry{ name = "Props/Bushes/bushes3" };
			public static ImageEntry bushes4 = new ImageEntry{ name = "Props/Bushes/bushes4" };
			public static ImageEntry bushes5 = new ImageEntry{ name = "Props/Bushes/bushes5" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ bushes1, bushes2, bushes3, bushes4, bushes5 } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
		public static class Clouds{
			public static ImageEntry cl1 = new ImageEntry{ name = "Props/Clouds/cl1" };
			public static ImageEntry cl2 = new ImageEntry{ name = "Props/Clouds/cl2" };
			public static ImageEntry cloud2 = new ImageEntry{ name = "Props/Clouds/cloud2" };
			public static ImageEntry clouds1a = new ImageEntry{ name = "Props/Clouds/clouds1a" };
			public static ImageEntry clouds1c = new ImageEntry{ name = "Props/Clouds/clouds1c" };
			public static ImageEntry clouds1d = new ImageEntry{ name = "Props/Clouds/clouds1d" };
			public static ImageEntry clouds1e = new ImageEntry{ name = "Props/Clouds/clouds1e" };
			public static ImageEntry clouds2a = new ImageEntry{ name = "Props/Clouds/clouds2a" };
			public static ImageEntry clouds2c = new ImageEntry{ name = "Props/Clouds/clouds2c" };
			public static ImageEntry clouds2d = new ImageEntry{ name = "Props/Clouds/clouds2d" };
			public static ImageEntry clouds3a = new ImageEntry{ name = "Props/Clouds/clouds3a" };
			public static ImageEntry clouds3b = new ImageEntry{ name = "Props/Clouds/clouds3b" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ cl1, cl2, cloud2, clouds1a, clouds1c, clouds1d, clouds1e, clouds2a, clouds2c, clouds2d, clouds3a, clouds3b } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
		public static class Trees{
			public static ImageEntry tree6b = new ImageEntry{ name = "Props/Trees/tree6b" };
			public static ImageEntry trees1a = new ImageEntry{ name = "Props/Trees/trees1a" };
			public static ImageEntry trees1b = new ImageEntry{ name = "Props/Trees/trees1b" };
			public static ImageEntry trees2a = new ImageEntry{ name = "Props/Trees/trees2a" };
			public static ImageEntry trees2b = new ImageEntry{ name = "Props/Trees/trees2b" };
			public static ImageEntry trees3a = new ImageEntry{ name = "Props/Trees/trees3a" };
			public static ImageEntry trees3b = new ImageEntry{ name = "Props/Trees/trees3b" };
			public static ImageEntry trees3c = new ImageEntry{ name = "Props/Trees/trees3c" };
			public static ImageEntry trees4a = new ImageEntry{ name = "Props/Trees/trees4a" };
			public static ImageEntry trees4b = new ImageEntry{ name = "Props/Trees/trees4b" };
			public static ImageEntry trees5a = new ImageEntry{ name = "Props/Trees/trees5a" };
			public static ImageEntry trees5b = new ImageEntry{ name = "Props/Trees/trees5b" };
			public static ImageEntry trees6a = new ImageEntry{ name = "Props/Trees/trees6a" };
			public static ImageEntry TreeWithHole = new ImageEntry{ name = "Props/Trees/TreeWithHole" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ tree6b, trees1a, trees1b, trees2a, trees2b, trees3a, trees3b, trees3c, trees4a, trees4b, trees5a, trees5b, trees6a, TreeWithHole } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
	}
	public static class raingame{
		public static ImageEntry fan1 = new ImageEntry{ name = "raingame/fan1" };
		public static ImageEntry fanblade1 = new ImageEntry{ name = "raingame/fanblade1" };
		public static ImageEntry fanblade2 = new ImageEntry{ name = "raingame/fanblade2" };
		public static ImageEntry umbrellaclosed1 = new ImageEntry{ name = "raingame/umbrellaclosed1" };
		public static ImageEntry umbrellaclosed2 = new ImageEntry{ name = "raingame/umbrellaclosed2" };
		public static ImageEntry umbrellaopen1 = new ImageEntry{ name = "raingame/umbrellaopen1" };
		public static ImageEntry umbrellaopen2 = new ImageEntry{ name = "raingame/umbrellaopen2" };
		public static ImageEntry waterlevel1 = new ImageEntry{ name = "raingame/waterlevel1" };
		public static ImageEntry waterlevel2 = new ImageEntry{ name = "raingame/waterlevel2" };
		public static ImageEntry waterlevel3 = new ImageEntry{ name = "raingame/waterlevel3" };
		public static ImageSet set = new ImageSet( new ImageEntry[]{ fan1, fanblade1, fanblade2, umbrellaclosed1, umbrellaclosed2, umbrellaopen1, umbrellaopen2, waterlevel1, waterlevel2, waterlevel3 } );
		public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		public static class barrel{
			public static ImageEntry barrel1 = new ImageEntry{ name = "raingame/barrel/barrel1" };
			public static ImageEntry barrel2 = new ImageEntry{ name = "raingame/barrel/barrel2" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ barrel1, barrel2 } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
		public static class cloud{
			public static ImageEntry nicecloud1 = new ImageEntry{ name = "raingame/cloud/nicecloud1" };
			public static ImageEntry nicecloud2 = new ImageEntry{ name = "raingame/cloud/nicecloud2" };
			public static ImageEntry nicecloud3 = new ImageEntry{ name = "raingame/cloud/nicecloud3" };
			public static ImageEntry nicecloud4 = new ImageEntry{ name = "raingame/cloud/nicecloud4" };
			public static ImageEntry nicecloud5 = new ImageEntry{ name = "raingame/cloud/nicecloud5" };
			public static ImageEntry nicecloud6 = new ImageEntry{ name = "raingame/cloud/nicecloud6" };
			public static ImageEntry nicecloud7 = new ImageEntry{ name = "raingame/cloud/nicecloud7" };
			public static ImageEntry nicecloud8 = new ImageEntry{ name = "raingame/cloud/nicecloud8" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ nicecloud1, nicecloud2, nicecloud3, nicecloud4, nicecloud5, nicecloud6, nicecloud7, nicecloud8 } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
		public static class fish{
			public static ImageEntry fish1 = new ImageEntry{ name = "raingame/fish/fish1" };
			public static ImageEntry fish2 = new ImageEntry{ name = "raingame/fish/fish2" };
			public static ImageEntry fish3 = new ImageEntry{ name = "raingame/fish/fish3" };
			public static ImageEntry fish5 = new ImageEntry{ name = "raingame/fish/fish5" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ fish1, fish2, fish3, fish5 } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
		public static class fishbowl{
			public static ImageEntry fishbowl1 = new ImageEntry{ name = "raingame/fishbowl/fishbowl1" };
			public static ImageEntry fishbowl2 = new ImageEntry{ name = "raingame/fishbowl/fishbowl2" };
			public static ImageEntry fishbowl3 = new ImageEntry{ name = "raingame/fishbowl/fishbowl3" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ fishbowl1, fishbowl2, fishbowl3 } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
		public static class lightning{
			public static ImageEntry lightning1 = new ImageEntry{ name = "raingame/lightning/lightning1" };
			public static ImageEntry lightning2 = new ImageEntry{ name = "raingame/lightning/lightning2" };
			public static ImageEntry lightning3 = new ImageEntry{ name = "raingame/lightning/lightning3" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ lightning1, lightning2, lightning3 } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
		public static class lightningcloud{
			public static ImageEntry lightningcloud1 = new ImageEntry{ name = "raingame/lightningcloud/lightningcloud1" };
			public static ImageEntry lightningcloud2 = new ImageEntry{ name = "raingame/lightningcloud/lightningcloud2" };
			public static ImageEntry lightningcloud3 = new ImageEntry{ name = "raingame/lightningcloud/lightningcloud3" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ lightningcloud1, lightningcloud2, lightningcloud3 } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
		public static class lightningrod{
			public static ImageEntry lightningrod1 = new ImageEntry{ name = "raingame/lightningrod/lightningrod1" };
			public static ImageEntry lightningrod2 = new ImageEntry{ name = "raingame/lightningrod/lightningrod2" };
			public static ImageEntry lightningrod3 = new ImageEntry{ name = "raingame/lightningrod/lightningrod3" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ lightningrod1, lightningrod2, lightningrod3 } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
		public static class rain{
			public static ImageEntry rain1 = new ImageEntry{ name = "raingame/rain/rain1" };
			public static ImageEntry rain2 = new ImageEntry{ name = "raingame/rain/rain2" };
			public static ImageEntry rain3 = new ImageEntry{ name = "raingame/rain/rain3" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ rain1, rain2, rain3 } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
		public static class raincloud{
			public static ImageEntry raincloud1 = new ImageEntry{ name = "raingame/raincloud/raincloud1" };
			public static ImageEntry raincloud2 = new ImageEntry{ name = "raingame/raincloud/raincloud2" };
			public static ImageEntry raincloud3 = new ImageEntry{ name = "raingame/raincloud/raincloud3" };
			public static ImageEntry raincloud4 = new ImageEntry{ name = "raingame/raincloud/raincloud4" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ raincloud1, raincloud2, raincloud3, raincloud4 } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
	}
	public static class Reacts{
		public static ImageEntry graybkg = new ImageEntry{ name = "Reacts/graybkg" };
		public static ImageEntry ow = new ImageEntry{ name = "Reacts/ow" };
		public static ImageEntry talkBkg = new ImageEntry{ name = "Reacts/talkBkg" };
		public static ImageEntry thud = new ImageEntry{ name = "Reacts/thud" };
		public static ImageEntry ugh = new ImageEntry{ name = "Reacts/ugh" };
		public static ImageSet set = new ImageSet( new ImageEntry[]{ graybkg, ow, talkBkg, thud, ugh } );
		public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
	}
	public static class resources{
		public static ImageEntry asparagus = new ImageEntry{ name = "resources/asparagus" };
		public static ImageEntry banana = new ImageEntry{ name = "resources/banana" };
		public static ImageEntry bottle1 = new ImageEntry{ name = "resources/bottle1" };
		public static ImageEntry bottle2 = new ImageEntry{ name = "resources/bottle2" };
		public static ImageEntry cake = new ImageEntry{ name = "resources/cake" };
		public static ImageEntry canofbeans = new ImageEntry{ name = "resources/canofbeans" };
		public static ImageEntry canofsoda = new ImageEntry{ name = "resources/canofsoda" };
		public static ImageEntry chicken_drumstick = new ImageEntry{ name = "resources/chicken_drumstick" };
		public static ImageEntry corn = new ImageEntry{ name = "resources/corn" };
		public static ImageEntry dollar1 = new ImageEntry{ name = "resources/dollar1" };
		public static ImageEntry dollar2 = new ImageEntry{ name = "resources/dollar2" };
		public static ImageEntry glass = new ImageEntry{ name = "resources/glass" };
		public static ImageEntry icecreambowl = new ImageEntry{ name = "resources/icecreambowl" };
		public static ImageEntry pizza1 = new ImageEntry{ name = "resources/pizza1" };
		public static ImageEntry pizza2 = new ImageEntry{ name = "resources/pizza2" };
		public static ImageEntry pizza3 = new ImageEntry{ name = "resources/pizza3" };
		public static ImageEntry shrimp = new ImageEntry{ name = "resources/shrimp" };
		public static ImageEntry strawberry1 = new ImageEntry{ name = "resources/strawberry1" };
		public static ImageEntry strawberry2 = new ImageEntry{ name = "resources/strawberry2" };
		public static ImageEntry taco1 = new ImageEntry{ name = "resources/taco1" };
		public static ImageEntry taco2 = new ImageEntry{ name = "resources/taco2" };
		public static ImageEntry tbone_steak = new ImageEntry{ name = "resources/tbone_steak" };
		public static ImageEntry watermelon = new ImageEntry{ name = "resources/watermelon" };
		public static ImageEntry wine1 = new ImageEntry{ name = "resources/wine1" };
		public static ImageSet set = new ImageSet( new ImageEntry[]{ asparagus, banana, bottle1, bottle2, cake, canofbeans, canofsoda, chicken_drumstick, corn, dollar1, dollar2, glass, icecreambowl, pizza1, pizza2, pizza3, shrimp, strawberry1, strawberry2, taco1, taco2, tbone_steak, watermelon, wine1 } );
		public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
	}
	public static class Shadow{
		public static ImageEntry shadow3 = new ImageEntry{ name = "Shadow/shadow3" };
		public static ImageSet set = new ImageSet( new ImageEntry[]{ shadow3 } );
		public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
	}
	public static class Sounds{
		public static SoundEntry boomend = new SoundEntry{ name = "Sounds/boomend" };
		public static SoundEntry boomstart2 = new SoundEntry{ name = "Sounds/boomstart2" };
		public static SoundEntry bump = new SoundEntry{ name = "Sounds/bump" };
		public static SoundEntry complain1 = new SoundEntry{ name = "Sounds/complain1" };
		public static SoundEntry dying1 = new SoundEntry{ name = "Sounds/dying1" };
		public static SoundEntry flick = new SoundEntry{ name = "Sounds/flick" };
		public static SoundEntry multihit1 = new SoundEntry{ name = "Sounds/multihit1" };
		public static SoundEntry point1a = new SoundEntry{ name = "Sounds/point1a" };
		public static SoundEntry point2a = new SoundEntry{ name = "Sounds/point2a" };
		public static SoundEntry point3a = new SoundEntry{ name = "Sounds/point3a" };
		public static SoundEntry salute = new SoundEntry{ name = "Sounds/salute" };
		public static SoundEntry up1 = new SoundEntry{ name = "Sounds/up1" };
		public static SoundSet snds = new SoundSet( new SoundEntry[]{ boomend, boomstart2, bump, complain1, dying1, flick, multihit1, point1a, point2a, point3a, salute, up1 } );
		public static AudioClip rand(){ return snds.files[Random.Range(0, snds.files.Length)].snd; }
		public static class BalloonPop{
			public static SoundEntry balloon1 = new SoundEntry{ name = "Sounds/BalloonPop/balloon1" };
			public static SoundEntry balloon2 = new SoundEntry{ name = "Sounds/BalloonPop/balloon2" };
			public static SoundEntry balloon3 = new SoundEntry{ name = "Sounds/BalloonPop/balloon3" };
			public static SoundSet snds = new SoundSet( new SoundEntry[]{ balloon1, balloon2, balloon3 } );
			public static AudioClip rand(){ return snds.files[Random.Range(0, snds.files.Length)].snd; }
		}
		public static class CoinGrab{
			public static SoundEntry coin1 = new SoundEntry{ name = "Sounds/CoinGrab/coin1" };
			public static SoundEntry coin2 = new SoundEntry{ name = "Sounds/CoinGrab/coin2" };
			public static SoundEntry coin3 = new SoundEntry{ name = "Sounds/CoinGrab/coin3" };
			public static SoundSet snds = new SoundSet( new SoundEntry[]{ coin1, coin2, coin3 } );
			public static AudioClip rand(){ return snds.files[Random.Range(0, snds.files.Length)].snd; }
		}
	}
	public static class Text{
		public static ImageEntry TextName = new ImageEntry{ name = "Text/TextName" };
		public static ImageSet set = new ImageSet( new ImageEntry[]{ TextName } );
		public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
	}
	public static class Toys{
		public static class Balloons{
			public static ImageEntry balloon1 = new ImageEntry{ name = "Toys/Balloons/balloon1" };
			public static ImageEntry balloon2 = new ImageEntry{ name = "Toys/Balloons/balloon2" };
			public static ImageEntry balloon3 = new ImageEntry{ name = "Toys/Balloons/balloon3" };
			public static ImageEntry balloon4 = new ImageEntry{ name = "Toys/Balloons/balloon4" };
			public static ImageEntry balloon5 = new ImageEntry{ name = "Toys/Balloons/balloon5" };
			public static ImageEntry balloon6 = new ImageEntry{ name = "Toys/Balloons/balloon6" };
			public static ImageEntry balloon7 = new ImageEntry{ name = "Toys/Balloons/balloon7" };
			public static ImageEntry balloon8 = new ImageEntry{ name = "Toys/Balloons/balloon8" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ balloon1, balloon2, balloon3, balloon4, balloon5, balloon6, balloon7, balloon8 } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
		public static class Balls{
			public static ImageEntry ball1 = new ImageEntry{ name = "Toys/Balls/ball1" };
			public static ImageEntry ball2 = new ImageEntry{ name = "Toys/Balls/ball2" };
			public static ImageEntry ball3 = new ImageEntry{ name = "Toys/Balls/ball3" };
			public static ImageEntry ball4 = new ImageEntry{ name = "Toys/Balls/ball4" };
			public static ImageEntry ball5 = new ImageEntry{ name = "Toys/Balls/ball5" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ ball1, ball2, ball3, ball4, ball5 } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
	}
	public static class UI{
		public static ImageEntry BackgroundShell = new ImageEntry{ name = "UI/BackgroundShell" };
		public static ImageEntry blueorb = new ImageEntry{ name = "UI/blueorb" };
		public static ImageEntry chargebar1 = new ImageEntry{ name = "UI/chargebar1" };
		public static ImageEntry chargebar2 = new ImageEntry{ name = "UI/chargebar2" };
		public static ImageEntry cutsceneBorder = new ImageEntry{ name = "UI/cutsceneBorder" };
		public static ImageEntry healthbar1 = new ImageEntry{ name = "UI/healthbar1" };
		public static ImageEntry healthbar2 = new ImageEntry{ name = "UI/healthbar2" };
		public static ImageEntry howtoplay = new ImageEntry{ name = "UI/howtoplay" };
		public static ImageEntry incomingHUD = new ImageEntry{ name = "UI/incomingHUD" };
		public static ImageEntry minihealthbar = new ImageEntry{ name = "UI/minihealthbar" };
		public static ImageEntry minihealthbarCenter = new ImageEntry{ name = "UI/minihealthbarCenter" };
		public static ImageEntry minihealthbarRight = new ImageEntry{ name = "UI/minihealthbarRight" };
		public static ImageEntry timeui = new ImageEntry{ name = "UI/timeui" };
		public static ImageEntry title = new ImageEntry{ name = "UI/title" };
		public static ImageEntry waveDivider = new ImageEntry{ name = "UI/waveDivider" };
		public static ImageEntry whitesquare = new ImageEntry{ name = "UI/whitesquare" };
		public static ImageEntry whitesquareBottomCenter = new ImageEntry{ name = "UI/whitesquareBottomCenter" };
		public static ImageSet set = new ImageSet( new ImageEntry[]{ BackgroundShell, blueorb, chargebar1, chargebar2, cutsceneBorder, healthbar1, healthbar2, howtoplay, incomingHUD, minihealthbar, minihealthbarCenter, minihealthbarRight, timeui, title, waveDivider, whitesquare, whitesquareBottomCenter } );
		public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		public static class RoundNums{
			public static ImageEntry round1 = new ImageEntry{ name = "UI/RoundNums/round1" };
			public static ImageEntry round10 = new ImageEntry{ name = "UI/RoundNums/round10" };
			public static ImageEntry round11 = new ImageEntry{ name = "UI/RoundNums/round11" };
			public static ImageEntry round12 = new ImageEntry{ name = "UI/RoundNums/round12" };
			public static ImageEntry round2 = new ImageEntry{ name = "UI/RoundNums/round2" };
			public static ImageEntry round3 = new ImageEntry{ name = "UI/RoundNums/round3" };
			public static ImageEntry round4 = new ImageEntry{ name = "UI/RoundNums/round4" };
			public static ImageEntry round5 = new ImageEntry{ name = "UI/RoundNums/round5" };
			public static ImageEntry round6 = new ImageEntry{ name = "UI/RoundNums/round6" };
			public static ImageEntry round7 = new ImageEntry{ name = "UI/RoundNums/round7" };
			public static ImageEntry round8 = new ImageEntry{ name = "UI/RoundNums/round8" };
			public static ImageEntry round9 = new ImageEntry{ name = "UI/RoundNums/round9" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ round1, round10, round11, round12, round2, round3, round4, round5, round6, round7, round8, round9 } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
		public static class Title{
			public static ImageEntry and = new ImageEntry{ name = "UI/Title/and" };
			public static ImageEntry gods = new ImageEntry{ name = "UI/Title/gods" };
			public static ImageEntry howtoplay = new ImageEntry{ name = "UI/Title/howtoplay" };
			public static ImageEntry of = new ImageEntry{ name = "UI/Title/of" };
			public static ImageEntry socks = new ImageEntry{ name = "UI/Title/socks" };
			public static ImageEntry spoons = new ImageEntry{ name = "UI/Title/spoons" };
			public static ImageSet set = new ImageSet( new ImageEntry[]{ and, gods, howtoplay, of, socks, spoons } );
			public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }
		}
	}
}