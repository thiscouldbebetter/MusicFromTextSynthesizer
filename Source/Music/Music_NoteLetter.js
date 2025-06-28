
class Music_NoteLetter
{
	constructor(symbol, frequencyMultiplier)
	{
		this.symbol = symbol;
		this.frequencyMultiplier = frequencyMultiplier;
	}

	static TonesPerOctave = 12;
	static OctavesPerTone = 1 / Music_NoteLetter.TonesPerOctave;

	static Instances()
	{
		if (this._instances == null)
		{
			this._instances = new Music_NoteLetter_Instances();
		}
		return this._instances;
	}

	static parseFromString(noteLetterAsString)
	{
		var returnValue = null;

		var noteLettersAll = Music_NoteLetter.Instances()._All;
		var numberOfNoteLetters = noteLettersAll.length;

		for (var n = 0; n < numberOfNoteLetters; n++)
		{
			var noteLetter = noteLettersAll[n];

			if (noteLetterAsString == noteLetter.symbol)
			{
				returnValue = noteLetter;
				break;
			}
		}

		return returnValue;
	}

	static bySymbol(symbol)
	{
		return this.Instances().bySymbol(symbol);
	}
}

class Music_NoteLetter_Instances
{
	constructor()
	{
		var octavesPerTone = Music_NoteLetter.OctavesPerTone;

		this.Rest = new Music_NoteLetter("R_", 0);

		this.C 		= new Music_NoteLetter("C_", Math.pow(2, 0 * octavesPerTone) );
		this.CSharp = new Music_NoteLetter("C#", Math.pow(2, 1 * octavesPerTone) );
		this.DFlat 	= new Music_NoteLetter("Db", Math.pow(2, 1 * octavesPerTone) );
		this.D 		= new Music_NoteLetter("D_", Math.pow(2, 2 * octavesPerTone) );
		this.DSharp = new Music_NoteLetter("D#", Math.pow(2, 3 * octavesPerTone) );
		this.EFlat 	= new Music_NoteLetter("Eb", Math.pow(2, 3 * octavesPerTone) );
		this.E 		= new Music_NoteLetter("E_", Math.pow(2, 4 * octavesPerTone) );
		this.F 		= new Music_NoteLetter("F_", Math.pow(2, 5 * octavesPerTone) );
		this.FSharp = new Music_NoteLetter("F#", Math.pow(2, 6 * octavesPerTone) );
		this.GFlat 	= new Music_NoteLetter("Gb", Math.pow(2, 6 * octavesPerTone) );
		this.G 		= new Music_NoteLetter("G_", Math.pow(2, 7 * octavesPerTone) );
		this.GSharp = new Music_NoteLetter("G#", Math.pow(2, 8 * octavesPerTone) );
		this.AFlat 	= new Music_NoteLetter("Ab", Math.pow(2, 8 * octavesPerTone) );
		this.A 		= new Music_NoteLetter("A_", Math.pow(2, 9 * octavesPerTone) );
		this.ASharp = new Music_NoteLetter("A#", Math.pow(2, 10 * octavesPerTone) );
		this.BFlat 	= new Music_NoteLetter("Bb", Math.pow(2, 10 * octavesPerTone) );
		this.B 		= new Music_NoteLetter("B_", Math.pow(2, 11 * octavesPerTone) );

		this._All = 
		[
			this.Rest,

			this.A,
			this.ASharp,
			this.BFlat,
			this.B,
			this.C,
			this.CSharp,
			this.DFlat,
			this.D,
			this.DSharp,
			this.EFlat,
			this.E,
			this.F,
			this.FSharp,
			this.GFlat,
			this.G,
			this.GSharp,
			this.AFlat
		];

		this._AllBySymbol = new Map(this._All.map(x => [x.symbol, x] ) );
	}

	bySymbol(symbol)
	{
		return this._AllBySymbol.get(symbol);
	}
}
