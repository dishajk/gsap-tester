import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import logo from './images/DP130155.jpg';
import './App.css';

gsap.registerPlugin(ScrollTrigger)

const sections = [
  {
    title: 'Title 1',
    subtitle: 'subtitle 1'
  },
  {
    title: 'Title 2',
    subtitle: 'subtitle 2'
  },
  {
    title: 'Title 3',
    subtitle: 'subtitle 3'
  }
]
function App() {

  const headerRef = useRef(null)
  const [background, setBackground] = useState('#282c34')
  const revealRefs = useRef([])
  revealRefs.current = []

  const toggleBackground = () => {
    const color = background !== '#282c34' ? '#282c34' : '#273329'
    setBackground(color);
  }

  useEffect(() => {
    gsap.to(headerRef.current, {
      duration: 1,
      backgroundColor: background,
      ease: "none"
    })
    
  }, [background])
  useEffect(() => {

    gsap.from(headerRef.current, {
      duration: 1,
      autoAlpha: 0,
      ease: "none",
      delay: 0.1,
    });

    revealRefs.current.forEach((divElement, index) => {
      gsap.fromTo(divElement, {
        autoAlpha: 0}, {
          duration: 1,
          autoAlpha: 1,
          ease: 'none',
          scrollTrigger: {
            id: `section-$(index+1)`,
            trigger: divElement,
            start: 'top center += 100',
            toggleActions: 'play none none reverse',
            markers: true
          }
        })
    })

  }, [])

  const addToRefs = (element) => {
    if(element && !revealRefs.current.includes(element)){
      revealRefs.current.push(element);
    }
    console.log(revealRefs.current)
  }

  return (
    <div className="App">
      <header ref={headerRef} className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          1. Fade in the header when the page loads
        </p>
        <button onClick={toggleBackground}>Toggle Background color</button>
      </header>
      <main>
        <p>ref=addToRefs is attached to following dev elements, addToRefs is a function who argument is the div attached, which is then used to create an array of divs to which addToRefs is attached </p>
        {sections.map(({title, subtitle}) => {
          return(
            <div key={title} className='app-section' ref={addToRefs}>
              <h2>{title}</h2>
              <p>{subtitle}</p>
            </div>
          )
        })}
      </main>
    </div>
  );
}

export default App;
