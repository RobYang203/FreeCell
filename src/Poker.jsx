import React from "react"
export default class Board extends React.Component{
	constructor(props){
		super(props);

		this.state = {pokers:[null,null,null,null,null,null,null,null]}; 		
		this.getPokerNumber = this.getPokerNumber.bind(this);
		this.getPokerSuit = this.getPokerSuit.bind(this);
		this.createPokerList = this.createPokerList.bind(this);
		this.createPokerCard = this.createPokerCard.bind(this);
		this.getRandom = this.getRandom.bind(this);
		this.shufflePoker = this.shufflePoker.bind(this);
		this.onLicensing = this.onLicensing.bind(this);
		this.sfPokerList = this.shufflePoker();
		this.createSetPokerAreaList = this.createSetPokerAreaList.bind(this);
		
		console.log(this.sfPokerList);
	}
	render(){
		const setPokerAreaList = this.createSetPokerAreaList();
		return(
			<div>
				{setPokerAreaList}
			</div>
			);
	}
	componentDidMount(){
		this.onLicensing();
		/*
		for(let i =0; i < 8 ; i++){
			const tmp = i+1;
			const number = this.getPokerNumber(tmp);
			const suit = this.getPokerSuit(tmp)
			const poker = <Poker number={number} suit={suit} />
			const _that = this;
			setTimeout(function(){
				_that.setState({
					poker:poker
				});
			},tmp * 500);
			
		}*/
	}

	//建立撲克牌實體
	createPokerCard(cardNumber){
		const number = this.getPokerNumber(cardNumber);
		const suit = this.getPokerSuit(cardNumber)
		const poker = <Poker number={number} suit={suit} />
		return poker;
	}

	//取得目前數字
	getPokerNumber(i){
		const index = i%13;
		let ret = "";
		switch(index){
			case 1:
				ret = "A";
				break;
			case 11:
				ret = "J";
				break;
			case 12:
				ret = "Q";
				break;
			case 0:
				ret = "K";
				break;
			default:
				ret = index.toString();
				break;	
		}
		return ret;
	}

	//取得目前撲克花色
	getPokerSuit(i){
		const index = parseInt(i/13);
		let ret = "";
		switch(index){
			case 0:
				ret = "spade";
				break;
			case 1:
				ret = "heart";
				break;
			case 2:
				ret = "diamond";
				break;
			case 3:
				ret = "club";
				break;
		}
		return ret;
	}

	//建立放置撲克牌區域
	createSetPokerAreaList(){
		const ret = []; 
		for(let i =0; i < 8 ; i++){
			const tmp = <SetPokersArea areaIndex={i} poker={this.state.pokers[i]} onLicensing={this.onLicensing}/>;		
			ret.push(tmp);	
		}
		return ret;
	}

	//建立撲克牌陣列 1 - 52
	createPokerList(){
		const ret = [];
		for(let i = 0 ; i < 52 ; i++){
			ret.push(i+1);
		}
		return ret;
	}



	//洗牌
	shufflePoker(){
		const pokerList = this.createPokerList();
		const ret = [];
		do{
			const max = pokerList.length-1;
			const i = this.getRandom(max);
			ret.push(pokerList[i]);
			pokerList.splice(i,1);
		}while(pokerList.length > 1)
		return ret;
	}

	getRandom(max){
    	return Math.floor(Math.random()*max)+1;
	}
	// 發牌回應 ，對每區每次發一張，發到牌沒有
	onLicensing(i){
		const isDone = this.sfPokerList.length === 0;
		if(isDone)
			return;
		const isZeroing = i === undefined || i === 7;
		const newAreaIndex = isZeroing ? 0 : i +1 ;
		const {pokers} = this.state;
		pokers[newAreaIndex] = this.createPokerCard(this.sfPokerList[0]);
		this.setState({pokers:pokers});
		this.sfPokerList.splice(0,1);
	}
}




class SetPokersArea extends React.Component{
	constructor(props){
		super(props);
		this.pokerList = [];

	}
	componentWillUpdate(nextProps){
		const isAdded =  nextProps.poker === null || nextProps.poker === this.props.poker ;
		if(isAdded)
			return ;
		const index = this.pokerList.length;
		const newPoker = <PokerHolder poker={nextProps.poker} index={index}/>;
		this.pokerList.push(newPoker);
		this.props.onLicensing(nextProps.areaIndex);
	}
	render(){
		return(
			<div className="setPokersArea">
				{this.pokerList}
			</div>
			

			);
	}
}

function PokerHolder(props){
	const {poker,index} = props;
	const style={
		top: index * 45
	};
	return(
		<div className="pokerHolder" style={style}>
			{poker}
		</div>
		);
}



class Poker extends React.Component{
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
			<div className="pokerCard">
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
					return <div className={item}></div>;
				})}
			</div>
			);
}