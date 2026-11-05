import { useEffect, useState } from 'react'
import { Story } from 'inkjs'
import storySource from './story.js?raw'

function getStoryContent(source) {
	const start = source.indexOf('{')
	const end = source.lastIndexOf('}')

	if (start === -1 || end === -1 || end <= start) {
		throw new Error('Could not read story content from story.js')
	}

	return JSON.parse(source.slice(start, end + 1))
}

function HomePage() {
	const [story, setStory] = useState(null)
	const [paragraphs, setParagraphs] = useState([])
	const [choices, setChoices] = useState([])
	const [error, setError] = useState('')

	const continueStory = currentStory => {
		const nextParagraphs = []

		while (currentStory.canContinue) {
			nextParagraphs.push(currentStory.Continue())
		}

		setParagraphs(previous => [...previous, ...nextParagraphs])
		setChoices(
			currentStory.currentChoices.map(choice => ({
				index: choice.index,
				text: choice.text,
			}))
		)
	}

	const startStory = () => {
		try {
			const storyContent = getStoryContent(storySource)
			const nextStory = new Story(storyContent)
			setStory(nextStory)
			setParagraphs([])
			setChoices([])
			setError('')
			continueStory(nextStory)
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to load story')
		}
	}

	useEffect(() => {
		startStory()
	}, [])

	const handleChoice = index => {
		if (!story) {
			return
		}

		story.ChooseChoiceIndex(index)
		setChoices([])
		continueStory(story)
	}

	return (
		<div>
			<h1>The Intercept</h1>

			{error && <p>{error}</p>}

			<div id="story">
				{paragraphs.map((paragraph, index) => (
					<p key={`${index}-${paragraph.slice(0, 10)}`}>{paragraph}</p>
				))}
			</div>

			<div>
				{choices.map(choice => (
					<button
						key={choice.index}
						type="button"
						onClick={() => handleChoice(choice.index)}
					>
						{choice.text}
					</button>
				))}

				<button
					type="button"
					onClick={startStory}
				>
					Restart story
				</button>
			</div>
		</div>
	)
}

export default HomePage