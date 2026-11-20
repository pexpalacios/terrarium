### Scenes

"scene id": {
	"init": true, //only for the first scene
	"text": [
		"",
		""
	],
	"image": "url", //should be routed to public/img/ by default. can be changed later
	"alt": "for the image",
	"choices": [
		{ "text": "", "target": "next scene id" },
		{ "text": "", "target": "next scene id" }
	]
},

### Dialogues

"dialogue id": {
	"speaker": "NPC name",
	"text": [
		"",
		""
	],
	"choices": [
		{ "text": "", "target": "next scene id" },
		{ "text": "", "target": "next scene id" }
	]
},

### Locations

{
	"location": {
		"minimap": "",
		"spots": [
			{"id": "loc-1", "x": 15, "y": 70},
			{"id": "loc-2", "x": 45, "y": 80},
			{"id": "loc-3", "x": 75, "y": 60}
		] ,
		"sunny-dawn": "bg-placeholder.png",
		"sunny-noon": "bg-placeholder.png",
		"sunny-sunset": "bg-placeholder.png",
		"sunny-night": "bg-placeholder.png",
		"cloudy-dawn": "bg-placeholder.png",
		"cloudy-noon": "bg-placeholder.png",
		"cloudy-sunset": "bg-placeholder.png",
		"cloudy-night": "bg-placeholder.png",
		"rainy-dawn": "bg-placeholder.png",
		"rainy-noon": "bg-placeholder.png",
		"rainy-sunset": "bg-placeholder.png",
		"rainy-night": "bg-placeholder.png"
	}
}

### Bugs

{
	"bug_00": {
		"name": "ladybug",
		"locations": ["location"],
		"time": ["dawn", "noon", "sunset", "night"],
		"weather": ["sunny", "cloudy", "rainy"],
		"probability": 0.5
	}
}