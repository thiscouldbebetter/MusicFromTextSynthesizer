
class UiEventHandler
{
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

		var songName = "DanceOfTheSugarPlumFairies";

		var songContentAsLines;
		if (notationFormatName == "A")
		{
			songContentAsLines =
			[
				"// \"Dance of the Sugar-Plum Fairies\",",
				"// from _The Nutcracker_,",
				"// by P.I. Tchaikovsky",
				"",
				"O:3;R.1;____________R.4;G.8;E.8;G.4;F#4;D#4;____E.4;D.8;D.8;____D.8;R.8;",
				"O:2;G.4;B.4;G.4;B.4;G.4;B.4;____G.4;B.4;G.4;____B.4;G.4;________B.4;____",
				"",
				"O:3;C#8;C#8;C#8;R.8;C.8;C.8;C.8;R.8;O:2;B.8;O:3;E.8;C.8;E.8;O:2;B.8;R.4;",
				"O:2;G.4;____B.4;____G.4;____B.4;________G.4;____B.4;____G.4;________B.4;",
			];
		}
		else if (notationFormatName == "B")
		{
			songContentAsLines =
			[
				"C D E F G A B C B A G F E D C"
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
