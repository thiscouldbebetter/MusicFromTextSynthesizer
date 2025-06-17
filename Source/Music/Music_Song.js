
class Music_Song
{
	constructor(name, movements)
	{
		this.name = name;
		this.movements = movements;
	}

	static fromNameAndString(name, stringToParse)
	{
		var newline = "\n";
		var commentMarker = "//";

		stringToParse =
			stringToParse
				.split(newline)
				.filter(x => x.startsWith(commentMarker) == false)
				.map(x => x.trim() )
				.join(newline);

		while (stringToParse.startsWith(newline) )
		{
			stringToParse = stringToParse.substring(1);
		}
		while (stringToParse.endsWith(newline) )
		{
			stringToParse = stringToParse.substring(0, stringToParse.length - 1);
		}

		var twoBlankLines = newline + newline + newline;
		var movementsAsStrings = stringToParse.split(twoBlankLines);
		var movements = movementsAsStrings.map
		(
			x => Music_Movement.fromString(x)
		);
		var song = new Music_Song(name, movements);
		return song;
	}
}
