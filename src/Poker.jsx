import React from "react"
export default class Poker extends React.Component{
	constructor(props){
		super(props);
		this.getSuitClass = this.getSuitClass.bind(this);
	}
	getSuitClass(suit){
		let ret = "card ";
		switch(suit){
			case "spade":
				ret += "suitspades";
				break;
			case "heart":
				ret += "suithearts";
				break;
			case "diamond":
				ret += "suitdiamonds";
				break;
			case "club":
				ret += "suitclubs";
				break;
		}
		return ret;
	}
	render(){
		const {number,suit} = this.props;
		const suitClass = this.getSuitClass(suit);
		return(
			<div>
				<div className={suitClass}>
				  <div className="front">
				    <div className="spotTop">{number}</div>
				    <PokerContent number={number}/>
				    <div className="spotBottom">{number}</div>		    
				  </div>
				</div>
			</div>
			);
	}
}

function PokerContent(props){
	const number =props.number;
	const cardGroup = {
		A : ["spotAce"],
		2 : ["spotB1","spotB5"],
		3 : ["spotB1","spotB3","spotB5"],
		4 : ["spotA1","spotA5","spotC1","spotC5"],
		5 : ["spotA1","spotA5","spotB3","spotC1","spotC5"],
		6 : ["spotA1","spotA3","spotA5","spotC1","spotC3","spotC5"],
		7 : ["spotA1","spotA3","spotA5","spotB3","spotC1","spotC3","spotC5"],
		8 : ["spotA1","spotA3","spotA5","spotB2","spotB4","spotC1","spotC3","spotC5"],
		9 : ["spotA1","spotA2","spotA4","spotA5","spotB3","spotC1","spotC2","spotC4","spotC5"],
		10 : ["spotA1","spotA2","spotA4","spotA5","spotB2","spotB4","spotC1","spotC2","spotC4","spotC5"],
		J : ["face Jack"],
		Q : ["face Queen"],
		K : ["face King"]	
	};
	const contentParam = cardGroup[number];
	return(

			<div className="card_content">
				{contentParam.map((item)=>{
					return <div class={item}></div>;
				})}
			</div>
			);
}