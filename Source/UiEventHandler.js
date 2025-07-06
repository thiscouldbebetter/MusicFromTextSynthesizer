
class UiEventHandler
{
	static body_Loaded()
	{
		var d = document;
		var selectNotationFormat =
			d.getElementById("selectNotationFormat");
		var notationFormats = Music_NotationFormat.Instances()._All;
		var notationFormatNames = notationFormats.map(x => x.name);
		var notationFormatsAsOptions =
			notationFormatNames.map
			(
				x =>
				{
					var o = d.createElement("option");
					o.innerHTML = x;
					return o;
				}
			);
		notationFormatsAsOptions.forEach
		(
			x => selectNotationFormat.options.add(x)
		);
	}

	static buttonClear_Clicked()
	{
		var d = document;

		var inputSongName = d.getElementById("inputSongName");
		inputSongName.value = "";

		var textareaSongAsStrings =
			d.getElementById("textareaSongAsStrings");
		textareaSongAsStrings.value = "";
	}

	static buttonDemo_Clicked()
	{
		var d = document;

		var selectNotationFormat =
			d.getElementById("selectNotationFormat");
		var notationFormatName =
			selectNotationFormat.value;

		var songName;;
		var songContentAsLines;

		if (notationFormatName == "A")
		{
			songName = "DanceOfTheSugarPlumFairies";
			songContentAsLines =
			[
				"// \"Dance of the Sugar-Plum Fairies\",",
				"// from _The Nutcracker_,",
				"// by P.I. Tchaikovsky",
				"",
				"O:3;R_1;............R_4;G_8;E_8;G_4;F#4;D#4;....E_4;D_8;D_8;....D_8;R_8;",
				"O:2;G_4;B_4;G_4;B_4;G_4;B_4;....G_4;B_4;G_4;....B_4;G_4;........B_4;....",
				"",
				"O:3;C#8;C#8;C#8;R_8;C_8;C_8;C_8;R_8;O:2;B_8;O:3;E_8;C_8;E_8;O:2;B_8;R_4;",
				"O:2;G_4;....B_4;....G_4;....B_4;........G_4;....B_4;....G_4;........B_4;",
			];
		}
		else if (notationFormatName == "B")
		{
			songName = "Scale";
			songContentAsLines =
			[
				"                     O+ O-                   ",
				"C_.D_.E_.F_.G_.A_.B_.C_.B_.A_.G_.F_.E_.D_.C_.",
				"",
				"",
				"                     O+ O-                   ",
				"C_.D_.E_.F_.G_.A_.B_.C_.B_.A_.G_.F_.E_.D_.C_.",
			];
		}
		else
		{
			throw new Error("Unrecognized notation format!");
		}

		var newline = "\n";
		var songContentAsString =
			songContentAsLines.join(newline);

		var inputSongName = d.getElementById("inputSongName");
		inputSongName.value = songName;

		var textareaSongAsStrings =
			d.getElementById("textareaSongAsStrings");
		textareaSongAsStrings.value = songContentAsString;
	}

	static buttonPlaySong_Clicked(event)
	{
		var songAsBytes = this.getSongAsBytes();

		var songAsStringBase64 = Base64Encoder.encodeBytes(songAsBytes);

		var songAsDataURI = "data:audio/wav;base64," + songAsStringBase64;

		var d = document;
		var htmlElementSoundSource = d.createElement("source");
		htmlElementSoundSource.src = songAsDataURI;

		var htmlElementAudio = d.createElement("audio");
		htmlElementAudio.autoplay = true;

		htmlElementAudio.appendChild(htmlElementSoundSource);

		d.body.appendChild(htmlElementAudio);
	}

	static buttonDownloadSong_Clicked(event)
	{
		var d = document;
		var inputSongName = d.getElementById("inputSongName");
		var songName = inputSongName.value;

		var songAsBytes = this.getSongAsBytes();

		var songAsArrayBuffer = new ArrayBuffer(songAsBytes.length);
		var songAsUIntArray = new Uint8Array(songAsArrayBuffer);
		for (var i = 0; i < songAsBytes.length; i++) 
		{
			songAsUIntArray[i] = songAsBytes[i];
		}

		var songFileAsBlob = new Blob
		(
			[ songAsArrayBuffer ], 
			{type:"application/type"}
		);

		var downloadLink = d.createElement("a");
		downloadLink.href = window.URL.createObjectURL(songFileAsBlob);
		downloadLink.download = songName + ".wav";
		downloadLink.click();
	}

	static selectNotationFormat_Changed(selectNotationFormat)
	{
		var d = document;
		this.buttonClear_Clicked();
	}

	static getSongAsBytes()
	{
		var d = document;
		var inputSongName = d.getElementById("inputSongName");
		var songName = inputSongName.value;

		var textareaSongAsStrings =
			d.getElementById("textareaSongAsStrings");
		var songAsString = textareaSongAsStrings.value;

		var selectNotationFormat =
			d.getElementById("selectNotationFormat");
		var notationFormatName =
			selectNotationFormat.value;
		var notationFormat =
			Music_NotationFormat.byName(notationFormatName);

		var songToSynthesize = notationFormat.songParseFromNameAndString
		(
			songName,
			songAsString
		);

		var songAsWavFile = MusicToWavFileConverter.convertSongToWavFile
		(
			songToSynthesize, 
			SamplingInfo.buildDefault()
		);

		var songAsBytes = songAsWavFile.writeToBytes();

		return songAsBytes;
	}
}
