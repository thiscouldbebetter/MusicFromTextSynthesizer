
class Music_NoteLetter
{
	constructor(symbol, frequencyMultiplier, isControlCode)
	{
		this.symbol = symbol;
		this.frequencyMultiplier = frequencyMultiplier;
		this.isControlCode = isControlCode;
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
}

class Music_NoteLetter_Instances
{
	constructor()
	{
		var octavesPerTone = Music_NoteLetter.OctavesPerTone;

		this.Rest = new Music_NoteLetter("R.", 0, false);

		this.C_ = new Music_NoteLetter("C.", Math.pow(2, 0 * octavesPerTone), false);
		this.Cs = new Music_NoteLetter("C#", Math.pow(2, 1 * octavesPerTone), false);
		this.D_ = new Music_NoteLetter("D.", Math.pow(2, 2 * octavesPerTone), false);
		this.Ds = new Music_NoteLetter("D#", Math.pow(2, 3 * octavesPerTone), false);
		this.E_ = new Music_NoteLetter("E.", Math.pow(2, 4 * octavesPerTone), false);
		this.F_ = new Music_NoteLetter("F.", Math.pow(2, 5 * octavesPerTone), false);
		this.Fs = new Music_NoteLetter("F#", Math.pow(2, 6 * octavesPerTone), false);
		this.G_ = new Music_NoteLetter("G.", Math.pow(2, 7 * octavesPerTone), false);
		this.Gs = new Music_NoteLetter("G#", Math.pow(2, 8 * octavesPerTone), false);
		this.A_ = new Music_NoteLetter("A.", Math.pow(2, 9 * octavesPerTone), false);
		this.As = new Music_NoteLetter("A#", Math.pow(2, 10 * octavesPerTone), false);
		this.B_ = new Music_NoteLetter("B.", Math.pow(2, 11 * octavesPerTone), false);

		this._All = 
		[
			this.Rest,

			this.A_, 
			this.As, 
			this.B_, 
			this.C_, 
			this.Cs, 
			this.D_, 
			this.Ds, 
			this.E_, 
			this.F_, 
			this.Fs, 
			this.G_, 
			this.Gs,
		];
	}
}
