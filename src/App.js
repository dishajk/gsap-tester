import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

import logo from './images/DP130155.jpg';
import './App.css';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

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

const Box = ({ children, className, anim }) => {
  return <div className={"box " + className } data-animate={ anim }>{children}</div>;
};
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
// 
  const app = useRef();
  const circle = useRef();

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // use scoped selectors
      gsap.to(".box", { rotation: 360 });
      // or refs
      gsap.to(circle.current, { rotation: 360 });
      
    }, app);
    return () => ctx.revert();
  }, []);

  // scroll trigger three boxes

  const main = useRef();
  useLayoutEffect(() => {
    const ctx = gsap.context((self) => {
      const boxes = self.selector('.box');
      boxes.forEach((box) => {
        gsap.to(box, {
          x: 150,
          scrollTrigger: {
            trigger: box,
            start: 'bottom bottom',
            end: 'top 20%',
            scrub: true,
            markers: true,
          },
        });
      });
    }, main); // <- Scope!
    return () => ctx.revert(); // <- Cleanup!
  }, []);
//
const tl = useRef();
const container = useRef();

const toggleTimeline = () => {
  tl.current.reversed(!tl.current.reversed());
};

useLayoutEffect(() => {
  const ctx = gsap.context((self) => {
    const boxes = self.selector('.box');
    tl.current = gsap
      .timeline()
      .to(boxes[0], { x: 120, rotation: 360 })
      .to(boxes[1], { x: -120, rotation: -360 }, '<')
      .to(boxes[2], { y: -166 })
      .reverse();
  }, container);
  return () => ctx.revert();
}, []);

// 
const onEnter = ({ currentTarget }) => {
  gsap.to(currentTarget, { backgroundColor: "orange", scale: 1.2 });
};

const onLeave = ({ currentTarget }) => {
  gsap.to(currentTarget, { backgroundColor: "green", scale: 1 });
};


//

useLayoutEffect(() => {
    
  const ctx = gsap.context(() => {
    // Target the two specific elements we have asigned the animate class
    gsap.to("[data-animate='rotate']", {
      rotation: 360,
      repeat: -1,
      repeatDelay: 1,
      yoyo: true
    });
    
    gsap.to("[data-animate='move']", {
      x: 100,
      repeat: -1,
      repeatDelay: 1,
      yoyo: true
    });
    
    gsap.set(".dont-animate", {
      backgroundColor: 'red'
    });
    
  }, app);// <- Scope!
  
  return () => ctx.revert();
}, []);


//

const [count, setCount] = useState(0);
  const [delayedCount, setDelayedCount] = useState(0);

  // only runs on first render
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".box-1", { rotation: "+=360" });
    }, app);
    return () => ctx.revert();
  }, []);

  // runs on first render and every time delayedCount changes
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".box-2", { rotation: "+=360" });
    }, app);
    return () => ctx.revert();
  }, [delayedCount]);

  // runs on every render
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".box-3", { rotation: "+=360" });
    }, app);
    return () => ctx.revert();
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDelayedCount(count);
    }, 1000);

    return () => clearTimeout(timer);
  }, [count]);

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
        <section ref={app} className="App">
        
          <div className="box">selector is refered using the class</div>
          <div className="circle" ref={circle}>Ref is refered using ref</div>
          <p>Both are inside a section with ref = "app" that is being watched by useLayoutEffect</p>
        <p>In order to avoid creating a new timeline on every render, it's important to create the timeline inside an effect and store it in a ref.</p>
        </section>
        <div className="section flex-center column" ref={main}>
        <div className="box">box</div>
        <div className="box">box</div>
        <div className="box">box</div>
      </div>
      {/* <Router /> */}
      <section className="boxes-container" ref={container}>
        <h1>Use the button to toggle a Timeline</h1>
        <div>
          <button onClick={toggleTimeline}>Toggle Timeline</button>
          <p>The button is attached to a function that reverses the animation timeline</p>
        </div>
        <div className="box">Box 1</div>
        <div className="box">Box 2</div>
        <div className="box">Box 3</div>
      </section>


      <div className="app flex-row">
      Animating on interaction
      <div className="box" onMouseEnter={onEnter} onMouseLeave={onLeave}>
        Hover Me
      </div>
    </div>


    <div className="app" ref={app}>
      <Box anim="rotate">Box</Box>
      <Box className="dont-animate">Don't Animate Me</Box>
      <Box anim="move">Box</Box>
    </div>


    <div className="app" ref={app}>
      <div>
        <button onClick={() => setCount(count + 1)}>Click to trigger a render</button>
      </div>
      <p>Count: {count}</p>
      <p>Delayed Count: {delayedCount}</p>
      <p>Renders: {1 + delayedCount + count}</p>
      <div className="flex-row">
        <div className="box box-1 purple">First render</div>
        <div className="box box-2 blue">First render & delayed count change</div>
        <div className="box box-3 red">Every render</div>
      </div>
    </div>
      </main>
    </div>
  );
}

export default App;
