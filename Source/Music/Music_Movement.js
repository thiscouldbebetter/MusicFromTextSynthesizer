
class Music_Movement
{
	constructor(name, timeSignature, tempo, parts)
	{
		this.name = name;
		this.timeSignature = timeSignature;
		this.tempo = tempo;
		this.parts = parts;

		this.ticksPerSecond = 8; // hack
	}

	ticksPerQuarterNote()
	{
		var beatsPerQuarterNote =
			this.timeSignature.beatsPerQuarterNote();
		var secondsPerBeat =
			this.tempo.secondsPerBeat();
		var ticksPerBeat = this.ticksPerSecond * secondsPerBeat;
		var ticksPerQuarterNote =
			ticksPerBeat * beatsPerQuarterNote;
		return ticksPerQuarterNote;
	}
}
