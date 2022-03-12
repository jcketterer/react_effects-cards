import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import Card from './Card'
import './Deck.css'

const API_URL = 'http://deckofcardsapi.com/api/deck'

const Deck = () => {
  const [deck, setDeck] = useState(null)
  const [drawn, setDrawn] = useState([])
  const [autoDraw, setAutoDraw] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    async function data() {
      let data = await axios.get(`${API_URL}/new/shuffle/`)
      setDeck(data.data)
    }
    data()
  }, [setDeck])

  useEffect(() => {
    async function card() {
      let { deck_id } = deck

      try {
        let drawResponse = await axios.get(`${API_URL}/${deck_id}/draw/`)

        if (drawResponse.data.remaining === 0) {
          setAutoDraw(false)
          throw new Error('no cards left!')
        }

        const card = drawResponse.data.cards[0]

        setDrawn(d => [
          ...d,
          {
            id: card.code,
            name: card.suit + ' ' + card.value,
            image: card.image,
          },
        ])
      } catch (err) {
        alert(err)
      }
    }

    if (autoDraw && !timerRef.current) {
      timerRef.current = setInterval(async () => {
        await card()
      }, 1000)
    }

    return () => {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [autoDraw, setAutoDraw, deck])

  const autoDrawToggle = () => {
    setAutoDraw(auto => !auto)
  }

  const cards = drawn.map(card => <Card key={card.id} name={card.name} image={card.image} />)

  console.log(cards)

  return (
    <div className="Deck">
      {deck ? (
        <button className="Deck-btn" onClick={autoDrawToggle}>
          {autoDraw ? 'STOP' : 'KEEP'} DRAWING FOR ME!
        </button>
      ) : null}
      <div className="Deck-Card-Container">{cards}</div>
    </div>
  )
}

export default Deck
