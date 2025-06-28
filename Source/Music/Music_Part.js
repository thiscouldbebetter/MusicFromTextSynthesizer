
class Music_Part
{
	constructor(name, voice, volumeInitial, notes)
	{
		this.name = name;
		this.voice = voice;
		this.volumeInitial = volumeInitial;
		this.notes = notes;

		this.volumeCurrent = volumeInitial;
		this.octaveCurrent = Music_Octave.Instances().Default;
	}
}
