
class Music_Part
{
	constructor(name, voice, volumeInitial, notes)
	{
		this.name = name;
		this.voice = voice;
		this.volumeInitial = volumeInitial;
		this.notes = notes;
	}

	static fromString(partAsString)
	{
		var octaves = Music_Octave.Instances();
		var volumes = Music_Volume.Instances();
		var noteLetters = Music_NoteLetter.Instances();
		var voices = Music_Voice.Instances();

		this.volumeCurrent = volumes.Medium;
		this.octaveCurrent = octaves.Octave3;

		partAsString = partAsString.split(" ").join("");
		partAsString = partAsString.split("-").join("");
		partAsString = partAsString.split("_").join("");
		partAsString = partAsString.split("\t").join("");
		partAsString = partAsString.split("|").join("");

		var notesOrDynamicsAsStrings =
			partAsString.split(";").filter(x => x.trim() != "");
		var numberOfNotesOrDynamics = notesOrDynamicsAsStrings.length;
		var notesOrDynamics = [];

		for (var n = 0; n < numberOfNotesOrDynamics; n++)
		{
			var noteOrDynamicAsString = notesOrDynamicsAsStrings[n];

			var dynamicCodeMaybe = noteOrDynamicAsString[0];
			var dynamicForCode =
				Music_Dynamic.byCode(dynamicCodeMaybe);

			if (dynamicForCode != null)
			{
				var dynamicAsString = noteOrDynamicAsString;
				var dynamic = Music_Dynamic.parseFromString(dynamicAsString);
				notesOrDynamics[n] = dynamic;
				dynamic.applyToPart(this);
			}
			else
			{
				var noteAsString = noteOrDynamicAsString;

				var note = Music_Note.parseFromString
				(
					this.volumeCurrent, this.octaveCurrent, noteAsString
				);
				var noteLetter = note.pitches[0].noteLetter;
				if (noteLetter.isControlCode)
				{
					var controlCodeArgument = note.durationInTicks;

					if (noteLetter == noteLetters.Octave)
					{
						octaveCurrent = octaves.byIndex(controlCodeArgument);
					}
					else if (noteLetter == noteLetters.Volume)
					{
						volumeCurrent = volumes.byIndex(controlCodeArgument);
					}
				}

				notesOrDynamics[n] = note;
			}
		}

		var returnValue = new Music_Part
		(
			"[part from string]",
			voices.Sine,
			volumes.Medium,
			notesOrDynamics
		);

		return returnValue;
	}
}
