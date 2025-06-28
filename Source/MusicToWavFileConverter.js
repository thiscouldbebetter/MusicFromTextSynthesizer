class MusicToWavFileConverter
{
	static convertSongToWavFile(songToConvert, samplingInfo)
	{
		var returnValue = new WavFile
		(
			songToConvert.name + ".wav",
			samplingInfo,
			null // samples
		);

		for (var m = 0; m < songToConvert.movements.length; m++)
		{
			var movement = songToConvert.movements[m];

			var secondsPerBeat =
				1.0
				/
				(
					movement.tempo.beatsPerMinute
					/ Music.SecondsPerMinute
				); 

			for (var p = 0; p < movement.parts.length; p++)
			{
				var part = movement.parts[p];
				var voice = part.voice;

				var timeOffsetInSecondsCurrent = 0;

				var numberOfNotes = part.notes.length;

				for (var n = 0; n < numberOfNotes; n++)
				{
					var noteOrDynamic = part.notes[n];
					var noteOrDynamicTypeName = noteOrDynamic.constructor.name;
					if (noteOrDynamicTypeName == Music_Dynamic.name)
					{
						var dynamic = noteOrDynamic;
						// todo
					}
					else if (noteOrDynamicTypeName == Music_Note.name)
					{
						var note = noteOrDynamic;

						var notePitch = note.pitches[0];

						var noteDurationInSeconds =
							note.durationInSecondsForMovement(movement);

						var frequencyInCyclesPerSecond =
							notePitch.frequencyInCyclesPerSecond();

						this.addVoiceToWavFileSamples
						(
							returnValue, 
							voice, 
							note.volume,
							frequencyInCyclesPerSecond,
							timeOffsetInSecondsCurrent,
							noteDurationInSeconds
						);

						timeOffsetInSecondsCurrent += noteDurationInSeconds;
					}
					else
					{
						throw new Error("Neither a note nor a dynamic!");
					}
				}
			}
		}

		return returnValue;
	}

	static addVoiceToWavFileSamples
	(
		wavFile, 
		voice, 
		volume,
		frequencyInCyclesPerSecond,
		timeOffsetInSecondsStart, 
		durationToFilterInSeconds
	)
	{
		var samplingInfo = wavFile.samplingInfo;
		var numberOfChannels = samplingInfo.numberOfChannels;
		var samplesPerSecond = samplingInfo.samplesPerSecond;

		var sampleIndexStart =
			Math.round(timeOffsetInSecondsStart * samplesPerSecond);

		var durationToFilterInSamples =
			Math.round(durationToFilterInSeconds * samplesPerSecond);

		var sampleIndexEnd =
			sampleIndexStart + durationToFilterInSamples;

		var durationOfWavFileInSamples = wavFile.durationInSamples();
		if (durationOfWavFileInSamples < sampleIndexEnd)
		{
			wavFile.extendOrTrimSamples(sampleIndexEnd);
		}

		var samplesForChannels = wavFile.samplesForChannels;

		var secondsPerSample =
			1.0 / samplingInfo.samplesPerSecond;

		var samplePrototype = wavFile.samplingInfo.samplePrototype();

		for (var s = sampleIndexStart; s < sampleIndexEnd; s++)
		{
			var timeOffsetInSecondsCurrent =
				s * secondsPerSample;

			for (var c = 0; c < numberOfChannels; c++)
			{
				var sampleExisting =
					samplesForChannels[c][s];

				var voiceSampleValue = voice.sample
				(
					frequencyInCyclesPerSecond, 
					timeOffsetInSecondsCurrent
				) * volume.relativeLoudness;

				var sampleValueNew =
					sampleExisting.convertToDouble()
					+ voiceSampleValue;

				var sampleValueNewAbsolute = Math.abs(sampleValueNew);
				if (sampleValueNewAbsolute > 1)
				{
					sampleValueNew =
						sampleValueNew / sampleValueNewAbsolute;   
				}

				sampleExisting.setFromDouble(sampleValueNew);
			}
		}
	}
}
