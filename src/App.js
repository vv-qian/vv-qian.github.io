import "./App.css";
import Row from "./Row";
import prosports from "./portfolio/walkthrough/prosports.png";
import ballotrisk from "./portfolio/list/BALLOTRISK.png";
// import gradpayFull from "./portfolio/walkthrough/WEGRADPAY-full.jpg";
// import gradpay from "./portfolio/walkthrough/WEGRADPAY.png";

function App() {
  return (
    <div className="App">
      <Row left="Vanessa Qian" right="Located in Atlanta, GA" />
      <Row
        left="About"
        right={
          <div>
            <span>
            I currently work on various side projects, tinkering with AI coding agents to make AI-powered tools. My latest is doodle, if you'd like to check it out. I used to work as a data analyst at Block (aka Square). Previously, I worked as a frontend engineer at a startup called Premise. And before that, I worked at The Wall Street Journal and NPR as a data and graphics journalist.
            </span>
            <br />
            <br />
          </div>
        }
      />
      <Row left="Selected Work" right="From my time in news" />
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
        id="ballot-risk"
        left={
          <a href="https://www.wsj.com/articles/millions-of-mail-in-ballots-at-risk-in-battleground-states-with-looming-deadlines-11604152801">
            Millions of Mail-in Ballots at Risk in Battleground States With
            Looming Deadlines
          </a>
        }
        subtitle
      >
        <img src={ballotrisk} alt="" />
      </Row>
      {/* <Row
        id="program-over-prestige"
        left={
          <a href="https://www.wsj.com/articles/in-valuing-colleges-tops-in-prestige-doesnt-always-mean-tops-in-starting-salaries-11590532335">
            In Valuing Colleges, Tops in Prestige Doesn’t Always Mean Tops in
            Starting Salaries
          </a>
        }
        subtitle
      >
        <picture>
          <source media="(min-width:450px)" srcSet={gradpayFull} />
          <img src={gradpay} alt="" />
        </picture>
      </Row> */}
      <Row left="If you have a subscription, here are some others.">
        <div>
          <a href="A Decade of News: How the Big Stories Evolved">
            A Decade of News: How the Big Stories Evolved
          </a>{" "}
          &bull;{" "}
          <a href="https://www.wsj.com/graphics/march-changed-everything/">
            The Month Coronavirus Felled American Business
          </a>{" "}
          &bull;{" "}
          <a href="https://www.wsj.com/articles/play-the-credit-score-game-11571832001">
            The Credit Score Game
          </a>{" "}
          &bull;{" "}
          <a href="https://www.wsj.com/graphics/covid-storm-cases-deaths-testing-coronavirus-trump/">
            The Covid Storm
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
