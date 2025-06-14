
class WavFile
{
	constructor
	(
		filePath,
		samplingInfo,
		samplesForChannels
	)
	{
		this.filePath = filePath;
		this.samplingInfo = samplingInfo;
		this.samplesForChannels = samplesForChannels;

		 // hack
		if (this.samplingInfo == null)
		{
			this.samplingInfo = SamplingInfo.buildDefault();
		}

		if (this.samplesForChannels == null)
		{
			var numberOfChannels = this.samplingInfo.numberOfChannels; 

			this.samplesForChannels = [];
			for (var c = 0; c < numberOfChannels; c++)
			{
				this.samplesForChannels[c] = [];
			}
		}
	}

	// constants

	static BitsPerByte = 8;
	static NumberOfBytesInRiffWaveAndFormatChunks = 36;

	// static methods

	static readFromFile(fileToReadFrom)
	{
		var returnValue = new WavFile(fileToReadFrom.name, null, null);

		var fileReader = new FileReader();
		fileReader.onloadend(fileLoadedEvent)
		{
			if (fileLoadedEvent.target.readyState == FileReader.DONE)
			{
				var bytesFromFile = fileLoadedEvent.target.result;
				var reader = new ByteStreamLittleEndian(bytesFromFile);

				returnValue.readFromFilePath_ReadChunks(reader);
			}

			Globals.Instance.visualizer.loadFileAndVisualize_LoadComplete(returnValue);
		}

		fileReader.readAsBinaryString(fileToReadFrom);
	}

	readFromFilePath_ReadChunks(reader)
	{
		var riffStringAsBytes = reader.readBytes(4);

		var numberOfBytesInFile = reader.readInt();

		var waveStringAsBytes = reader.readBytes(4);

		this.readFromFile_ReadChunks_Format(reader);
		this.readFromFile_ReadChunks_Data(reader);
	}

	readFromFile_ReadChunks_Format(reader)
	{
		var fmt_StringAsBytes = reader.readBytes(4);
		var chunkSizeInBytes = reader.readInt();
		var formatCode = reader.readShort();

		var numberOfChannels = reader.readShort();
		var samplesPerSecond = reader.readInt();

		var bytesPerSecond = reader.readInt();
		var bytesPerSampleMaybe = reader.readShort();
		var bitsPerSample = reader.readShort();

		var samplingInfo = new SamplingInfo
		(
			"[from file]",
			chunkSizeInBytes,
			formatCode,
			numberOfChannels,
			samplesPerSecond,
			bitsPerSample	
		);

		this.samplingInfo = samplingInfo;
	}

	readFromFile_ReadChunks_Data(reader)
	{
		var dataStringAsBytes = reader.readBytes(4);
		var subchunk2SizeInBytes = reader.readInt();

		var samplesForChannelsMixedAsBytes = reader.readBytes(subchunk2SizeInBytes);

		var samplesForChannels = WavFile_Sample.buildManyFromBytes
		(
			this.samplingInfo,
			samplesForChannelsMixedAsBytes
		);

		this.samplesForChannels = samplesForChannels;
	}

	// instance methods

	durationInSamples()
	{
		var returnValue = 0;
		if (this.samplesForChannels != null)
		{
			if (this.samplesForChannels.length > 0)
			{
				returnValue = this.samplesForChannels[0].length;
			}
		}

		return returnValue;
	}

	durationInSeconds()
	{
		return this.durationInSamples() * this.samplingInfo.samplesPerSecond;
	}

	extendOrTrimSamples(numberOfSamplesToExtendOrTrimTo)
	{
		var numberOfChannels = this.samplingInfo.numberOfChannels;
		var samplesForChannelsNew = [];

		for (var c = 0; c < numberOfChannels; c++)
		{
			var samplesForChannelOld = this.samplesForChannels[c];
			var samplesForChannelNew = [];

			for (var s = 0; s < samplesForChannelOld.length && s < numberOfSamplesToExtendOrTrimTo; s++)
			{
				samplesForChannelNew[s] = samplesForChannelOld[s];
			}

			var samplePrototype = this.samplingInfo.samplePrototype();

			for (var s = samplesForChannelOld.length; s < numberOfSamplesToExtendOrTrimTo; s++)
			{
				samplesForChannelNew[s] = samplePrototype.build();
			}

			samplesForChannelsNew[c] = samplesForChannelNew;
		}

		this.samplesForChannels = samplesForChannelsNew;
	}

	writeToBytes()
	{
		var writer = new ByteStreamLittleEndian([]);

		this.writeToBytes_WriteChunks(writer);

		return writer.bytes;
	}

	writeToBytes_WriteChunks(writer)
	{
		writer.writeString("RIFF");

		// hack
		var numberOfBytesOfOverhead = 
			"RIFF".length
			+ "WAVE".length
			+ "fmt ".length
			+ 20 // additional bytes In format header
			+ "data".length;

			//+ 4; // additional bytes in data header?

		var numberOfBytesInFile = 
			this.samplingInfo.numberOfChannels
			* this.samplesForChannels[0].length
			* this.samplingInfo.bitsPerSample
			/ WavFile.BitsPerByte
			+ numberOfBytesOfOverhead;

		writer.writeInt(numberOfBytesInFile);

		writer.writeString("WAVE");

		this.writeToBytes_WriteChunks_Format(writer);
		this.writeToBytes_WriteChunks_Data(writer);
	}

	writeToBytes_WriteChunks_Format(writer)
	{
		writer.writeString("fmt ");

		writer.writeInt(this.samplingInfo.chunkSizeInBytes);
		writer.writeShort(this.samplingInfo.formatCode);

		writer.writeShort(this.samplingInfo.numberOfChannels);
		writer.writeInt(this.samplingInfo.samplesPerSecond);

		writer.writeInt(this.samplingInfo.bytesPerSecond);
		writer.writeShort(this.samplingInfo.bytesPerSampleMaybe);
		writer.writeShort(this.samplingInfo.bitsPerSample);
	}

	writeToBytes_WriteChunks_Data(writer)
	{
		writer.writeString("data");

		var samplesForChannelsMixedAsBytes =
			WavFile_Sample.convertManyToBytes
			(
				this.samplesForChannels,
				this.samplingInfo
			);

		writer.writeInt(samplesForChannelsMixedAsBytes.length);

		writer.writeBytes(samplesForChannelsMixedAsBytes);
	}

	// inner classes
}


class WavFile_Sample
{
	build(){}
	setFromBytes(valueAsBytes){}
	setFromDouble(valueAsDouble){}
	convertToBytes(){}
	convertToDouble(){}

	static buildManyFromBytes
	(
		samplingInfo,
		bytesToConvert
	)
	{
		var numberOfBytes = bytesToConvert.length;

		var numberOfChannels = samplingInfo.numberOfChannels;

		var returnSamples = [];

		var bytesPerSample = samplingInfo.bitsPerSample / WavFile.BitsPerByte;

		var samplesPerChannel =
			numberOfBytes
			/ bytesPerSample
			/ numberOfChannels;

		for (var c = 0; c < numberOfChannels; c++)
		{
			returnSamples[c] = [];
		}

		var b = 0;

		var halfMaxValueForEachSample = Math.pow
		(
			2, WavFile.BitsPerByte * bytesPerSample - 1
		);

		var samplePrototype = samplingInfo.samplePrototype();

		var sampleValueAsBytes = [];

		for (var s = 0; s < samplesPerChannel; s++)
		{
			for (var c = 0; c < numberOfChannels; c++)
			{
				for (var i = 0; i < bytesPerSample; i++)
				{
					sampleValueAsBytes[i] = bytesToConvert[b];
					b++;
				}

				returnSamples[c][s] = samplePrototype.build().setFromBytes
				(
					sampleValueAsBytes
				);
			}
		}

		return returnSamples;
	}

	static convertManyToBytes
	(
		samplesToConvert,
		samplingInfo
	)
	{
		var returnBytes = null;

		var numberOfChannels = samplingInfo.numberOfChannels;

		var samplesPerChannel = samplesToConvert[0].length;

		var bitsPerSample = samplingInfo.bitsPerSample;

		var bytesPerSample = bitsPerSample / WavFile.BitsPerByte;

		var numberOfBytes =
			numberOfChannels
			* samplesPerChannel
			* bytesPerSample;

		returnBytes = [];

		var halfMaxValueForEachSample = Math.pow
		(
			2, WavFile.BitsPerByte * bytesPerSample - 1
		);

		var b = 0;

		for (var s = 0; s < samplesPerChannel; s++)
		{
			for (var c = 0; c < numberOfChannels; c++)
			{
				var sample = samplesToConvert[c][s];	

				var sampleAsBytes = sample.convertToBytes();

				for (var i = 0; i < bytesPerSample; i++)
				{
					returnBytes[b] = sampleAsBytes[i];
					b++;
				}
			}
		}

		return returnBytes;
	}
}

class WavFile_Sample16
{
	constructor(value)
	{
		this.value = value;
	}

	static MaxValue = Math.pow(2, 15) - 1;
	static DoubleMaxValue = Math.pow(2, 16);

	// Sample members
	build()
	{
		return new WavFile_Sample16(0);
	}

	setFromBytes(valueAsBytes)
	{
		this.value =
		(
			(valueAsBytes[0] & 0xFF)
			| ((valueAsBytes[1] & 0xFF) << 8 )
		);

		if (this.value > WavFile_Sample16.MaxValue) 
		{
			this.value -= WavFile_Sample16.DoubleMaxValue;
		}

		return this;
	}

	setFromDouble(valueAsDouble)
	{
		this.value =
		(
			valueAsDouble * WavFile_Sample16.MaxValue
		);

		return this;
	}

	convertToBytes()
	{
		var returnValue = 
		[
			((this.value) & 0xFF),
			((this.value >>> 8 ) & 0xFF)
		];

		return returnValue;
	}

	convertToDouble()
	{
		return 1.0 * this.value / WavFile_Sample16.MaxValue;
	}
}


class WavFile_Sample24
{
	constructor(value)
	{
		this.value = value;
	}

	static MaxValue = Math.pow(2, 23) - 1;
	static DoubleMaxValue = Math.pow(2, 24);

	// Sample members

	build()
	{
		return new WavFile_Sample24(0);
	}

	setFromBytes(valueAsBytes)
	{
		this.value =
		(
			((valueAsBytes[0] & 0xFF))
			| ((valueAsBytes[1] & 0xFF) << 8 )
			| ((valueAsBytes[2] & 0xFF) << 16)
		);

		if (this.value > WavFile_Sample24.MaxValue) 
		{
			this.value -= WavFile_Sample24.DoubleMaxValue;
		}

		return this;
	}

	setFromDouble(valueAsDouble)
	{
		this.value = 
		(
			valueAsDouble
			* WavFile_Sample24.MaxValue
		);

		return this;
	}

	convertToBytes()
	{
		return new Array()
		{
			((this.value) & 0xFF),
			((this.value >>> 8 ) & 0xFF),
			((this.value >>> 16) & 0xFF)
		};
	}

	convertToDouble()
	{
		return 1.0 * this.value / WavFile_Sample24.MaxValue;
	}
}

class WavFile_Sample32
{
	constructor(value)
	{
		this.value = value;
	}

	static MaxValue = Math.pow(2, 32);
	static MaxValueHalf = Math.pow(2, 31);

	// Sample members

	build()
	{
		return new WavFile_Sample32(0);
	}

	setFromBytes(valueAsBytes)
	{
		this.value = 
		(
			((valueAsBytes[0] & 0xFF))
			| ((valueAsBytes[1] & 0xFF) << 8 )
			| ((valueAsBytes[2] & 0xFF) << 16)
			| ((valueAsBytes[3] & 0xFF) << 24)
		);

		if (this.value > WavFile_Sample32.MaxValue) 
		{
			this.value -= WavFile_Sample32.DoubleMaxValue;
		}

		return this;
	}

	setFromDouble(valueAsDouble)
	{
		this.value = 
		(
			valueAsDouble
			* WavFile_Sample32.MaxValue
		);

		return this;
	}

	convertToBytes()
	{
		return new Array()
		{
			((this.value) & 0xFF),
			((this.value >>> 8 ) & 0xFF),
			((this.value >>> 16) & 0xFF),
			((this.value >>> 24) & 0xFF)
		};
	}

	convertToDouble()
	{
		return 1.0 * this.value / WavFile_Sample32.MaxValue;
	}
}

class SamplingInfo
{
	constructor
	(
		name,
		chunkSizeInBytes,
		formatCode,
		numberOfChannels,
		samplesPerSecond,
		bitsPerSample
	)
	{
		this.name = name;
		this.chunkSizeInBytes = chunkSizeInBytes;
		this.formatCode = formatCode;
		this.numberOfChannels = numberOfChannels;
		this.samplesPerSecond = samplesPerSecond;
		this.bitsPerSample = bitsPerSample;
	}

	static buildDefault()
	{
		return new SamplingInfo
		(
			"Default",
			16, // chunkSizeInBytes
			1, // formatCode
			1, // numberOfChannels
			44100,	 // samplesPerSecond
			16 // bitsPerSample
		);
	}

	bytesPerSecond()
	{
		return this.samplesPerSecond
			* this.numberOfChannels
			* this.bitsPerSample / WavFile.BitsPerByte;
	}

	samplePrototype()
	{
		var returnValue = null;

		if (this.bitsPerSample == 16)
		{
			returnValue = new WavFile_Sample16(0);
		}
		else if (this.bitsPerSample == 24)
		{
			returnValue = new WavFile_Sample24(0);
		}
		else if (this.bitsPerSample == 32)
		{
			returnValue = new WavFile_Sample32(0);
		}

		return returnValue;
	}

	toString()
	{
		var returnValue =
			"<SamplingInfo "
			+ "chunkSizeInBytes='" + this.chunkSizeInBytes + "' "
			+ "formatCode='" + this.formatCode + "' "
			+ "numberOfChannels='" + this.numberOfChannels + "' "
			+ "samplesPerSecond='" + this.samplesPerSecond + "' "
			+ "bitsPerSample='" + this.bitsPerSample + "' "
			+ "/>";

		return returnValue;
	}
}
