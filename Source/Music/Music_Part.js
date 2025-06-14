
class Music_Part
{
	constructor(name, voice, volumeInitial, notes)
	{
		this.name = name;
		this.voice = voice;
		this.volumeInitial = volumeInitial;
		this.notes = notes;
	}

	static parseFromString(partAsString)
	{
		var octaves = Music_Octave.Instances();
		var volumes = Music_Volume.Instances();
		var noteLetters = Music_NoteLetter.Instances();
		var voices = Music_Voice.Instances();

		var volumeCurrent = volumes.Medium;
		var octaveCurrent = octaves.Octave3;

		partAsString = partAsString.split(" ").join("");
		partAsString = partAsString.split("-").join("");
		partAsString = partAsString.split("_").join("");
		partAsString = partAsString.split("\t").join("");
		partAsString = partAsString.split("|").join("");

		var notesAsStrings = partAsString.split(";");
		var numberOfNotes = notesAsStrings.length;
		var notes = [];

		for (var n = 0; n < numberOfNotes; n++)
		{
			var noteAsString = notesAsStrings[n];
			var note = Music_Note.parseFromString
			(
				volumeCurrent, octaveCurrent, noteAsString
			);
			var noteLetter = note.pitches[0].noteLetter;
			if (noteLetter.isControlCode == true)
			{
				var controlCodeArgument = note.duration;

				if (noteLetter == noteLetters.Octave)
				{
					octaveCurrent = octaves.byIndex(controlCodeArgument);
				}
				else if (noteLetter == noteLetters.Volume)
				{
					volumeCurrent = volumes.byIndex(controlCodeArgument);
				}
			}

			notes[n] = note;
		}

		var returnValue = new Music_Part
		(
			"[part from string]",
			voices.Sine,
			volumes.Medium,
			notes
		);

		return returnValue;
	}
}
