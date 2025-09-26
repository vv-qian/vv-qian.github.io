import "./App.css";
import Row from "./Row";
import prosports from "./portfolio/walkthrough/prosports-mobile-lowres.gif";
import creditscoregame from "./portfolio/walkthrough/CREDITSCOREGAME.gif";
import twentytens from "./portfolio/walkthrough/TWENTYTENS.gif";
import covidstorm from "./portfolio/walkthrough/COVIDSTORM_landing.gif";
import march from "./portfolio/walkthrough/MARCHCHANGEDEVERYTHING-bigtop.gif";

function App() {
  return (
    <div className="App">
      <Row left="Vanessa Qian" right="Located in Atlanta, GA" />
      <Row
        left="About"
        right={
          <div>
            <span>
            I'm currently building AI-powered side projects like <a href="https://doodle-flax.vercel.app/">doodle</a>. Previously, I was a data analyst at Block (fka Square), a frontend engineer at Premise, and a data journalist at The Wall Street Journal and NPR.
            </span>
            <br />
          </div>
        }
      />
      <Row left="Selected Work" right="From my time in news publications" />
      <Row
        id="pro-sports"
        left={
          <a href="https://www.wsj.com/graphics/tracking-the-diversity-of-pro-sports-leadership/">
            Tracking the Diversity of Pro Sports Leadership
          </a>
        }
        subtitle
      >
        <img src={prosports} alt="" />
      </Row>
      <Row
        id="credit-score"
        left={
          <a href="https://www.wsj.com/articles/play-the-credit-score-game-11571832001">
            The Credit Score Game
          </a>
        }
        subtitle
      >
        <img src={creditscoregame} alt="" />
      </Row>
      <Row
        id="covid-storm"
        left={
          <a href="https://www.wsj.com/graphics/covid-storm-cases-deaths-testing-coronavirus-trump/">
            The Covid Storm
          </a>
        }
        subtitle
      >
        <img src={covidstorm} alt="" />
      </Row>
      <Row
        id="march"
        left={
          <a href="https://www.wsj.com/graphics/march-changed-everything/">
            The Month Coronavirus Felled American Business
          </a>
        }
        subtitle
      >
        <img src={march} alt="" />
      </Row>
      <Row
        id="twenty-tens"
        left={
          <a href="https://www.wsj.com/graphics/a-decade-of-news">
            A Decade of News: How the Big Stories Evolved
          </a>
        }
        subtitle
      >
        <img src={twentytens} alt="" />
      </Row>
      <Row left="If you have a subscription, here are some others.">
        <div>
          <a href="https://www.wsj.com/articles/in-valuing-colleges-tops-in-prestige-doesnt-always-mean-tops-in-starting-salaries-11590532335">
            In Valuing Colleges, Tops in Prestige Doesn’t Always Mean Tops in
            Starting Salaries
          </a>{" "}
          &bull;{" "}
          <a href="https://www.wsj.com/articles/how-delayed-is-your-mail-in-ballot-11603706400">
            How Delayed Is Your Mail-In Ballot?
          </a>
        </div>
      </Row>
    </div>
  );
}

export default App;
