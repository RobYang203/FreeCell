import React from "react"
export default class Board extends React.Component{
	constructor(props){
		super(props);

		this.state = {
			pokers:[[],[],[],[],[],[],[],[],[]],
			showDragPkNumberList:[]
		}; 
	
		this.sfPokerList = this.shufflePoker();
		this.movingList =[];

		this.createPokerList = this.createPokerList.bind(this);
		this.getRandom = this.getRandom.bind(this);
		this.shufflePoker = this.shufflePoker.bind(this);
		this.onLicensing = this.onLicensing.bind(this);
		this.createSetPokerAreaList = this.createSetPokerAreaList.bind(this);
		this.setMovingDragImage = this.setMovingDragImage.bind(this);
		console.log(this.sfPokerList);
	}
	render(){
		const setPokerAreaList = this.createSetPokerAreaList();
		return(
			<div>
				{setPokerAreaList}
				<SetPokersArea areaIndex={-1} pkNumberList={this.state.showDragPkNumberList} isShowArea={true}/>
				<div id="test">123456</div>
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



	//建立放置撲克牌區域
	createSetPokerAreaList(){
		const ret = []; 
		for(let i =0; i < 8 ; i++){
			const tmp = <SetPokersArea areaIndex={i} pkNumberList={this.state.pokers[i]}
							setMovingDragImage={this.setMovingDragImage}
						/>;		
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
		}while(pokerList.length > 1);
		ret.push(pokerList[0]);
		return ret;
	}

	getRandom(max){
    	return Math.floor(Math.random()*max)+1;
	}
	// 發牌回應 ，對每區每次發一張，發到牌沒有
	onLicensing(){
		const pkNumberList = this.state.pokers;
		this.sfPokerList.map((pkNumber,i)=>{
				const pkIndex = i % 8;
				pkNumberList[pkIndex].push(pkNumber);
		})
		console.log(pkNumberList);
		this.setState({pokers:pkNumberList});
		
	}
	setMovingDragImage(movingList){
		this.movingList = movingList;
		const list = [];
		movingList.map((pkInfo)=>{
			list.push(pkInfo.pkNumber);
		});

		this.setState({
			showDragPkNumberList:list
		});
	}



}




class SetPokersArea extends React.Component{
	constructor(props){
		super(props);
		//areaState normal 、 dragging 、refresh
		this.state = {areaState:"normal"}

		this.pokerList = [];
		/*
			const pkInfo={
				pkNumber:pkNumber,
				number:0,
				state:"refresh",
				suit:null,
				color:null,
				interlockIndex:null
			};
		*/
		this.pkInfoList={};
		this.areaStyle= null;
		const isShowArea = this.props.isShowArea;
		this.showAreaClass = `setPokersArea ${isShowArea?"showDragImage":""}`;

		this.onDragEnter = this.onDragEnter.bind(this);
		this.onDragOver = this.onDragOver.bind(this);
		this.onDragLeave = this.onDragLeave.bind(this);

		this.onPokerDragStart = this.onPokerDragStart.bind(this);
		this.onPokerDrag = this.onPokerDrag.bind(this);
		this.onPokerDragEnd = this.onPokerDragEnd.bind(this);

		this.getPokerNumber = this.getPokerNumber.bind(this);
		this.getPokerSuit = this.getPokerSuit.bind(this);
		this.createPokerCard = this.createPokerCard.bind(this);
		this.setPkInfo  =this.setPkInfo.bind(this);
	}
	componentWillUpdate(nextProps, nextState){
		if(nextState.areaState === "normal")
			this.pkInfoList = this.setPkInfo(nextProps.pkNumberList);
		this.pokerList = [];
		let areaH = 222;
		this.pkInfoList.map((pkInfo,i)=>{		
			const tmp = this.createPokerCard( pkInfo, i);
			areaH += 45;
			if(tmp !== null)
				this.pokerList.push(tmp);
		});
		this.areaStyle={
			height:areaH+"px"
		}
		//console.log(this.pokerList);
	}

	render(){
		return(
			<div className={this.showAreaClass} 
				style={this.areaStyle}
				onDragEnter={(e)=>{this.onDragEnter(e)}}
				onDragOver={(e)=>{this.onDragOver(e)}}
				onDragLeave={(e)=>{this.onDragLeave(e)}}
				>
				{this.pokerList}				
			</div>
			
			);
	}

	onDragEnter(e){
		console.log("onDragEnter " );
		console.log(e);
		if(this.props.onDragEnter === null || this.props.onDragEnter === undefined)
			return;
		this.props.onDragEnter(e);

	}
	onDragOver(e){
		console.log("onDragOver");
		console.log(e);
		if(this.props.onDragOver === null || this.props.onDragOver === undefined)
			return;
		this.props.onDragOver(e);

	}
	onDragLeave(e){
		console.log("onDragLeave");
		console.log(e);
		if(this.props.onDragLeave === null || this.props.onDragLeave === undefined)
			return;
		this.props.onDragLeave(e);
	}

	onPokerDragStart(e, index){
		console.log("onDragStart"+ index);
		console.log(e);

		const dragPoker = this.pkInfoList[index];		
		dragPoker.state = "dragging";

		const moveList = [dragPoker];
		if(dragPoker.interlockIndex !== -1){
			let iLPKInfo = this.pkInfoList[dragPoker.interlockIndex];
			do{
				iLPKInfo.state ="movingLock";
				moveList.push(iLPKInfo);
				const nextInterlockIndex = iLPKInfo.interlockIndex;
				iLPKInfo = this.pkInfoList[nextInterlockIndex];
			}while(iLPKInfo !== null && iLPKInfo !== undefined);						
		}
		console.log(moveList);
		this.props.setMovingDragImage(moveList);

		e.dataTransfer.setDragImage(document.querySelector(".setPokersArea.showDragImage"), 0, 0);
		this.setState({areaState:"dragging"});
	}
	onPokerDragEnd(e, index){
		console.log("onDragEnd"+ index);
		console.log(e);
		this.pkInfoList[index].state = "refresh";
		this.setState({areaState:"normal"});
	}
	onPokerDrag(e, index){

		this.pkInfoList[index].state = "dragging";

	}

	//建立撲克牌實體
	createPokerCard(pkInfo ,index){
		const { number, suit, interlockIndex, state} = pkInfo;


		const isDraggable = interlockIndex !== null;

		const poker = 
			<PokerHolder index={index}
				spacing={45}
				Draggable={isDraggable}
				state={state}
				onPokerDragStart={this.onPokerDragStart}
				onPokerDrag={this.onPokerDrag}
				onPokerDragEnd={this.onPokerDragEnd}
				>
				<Poker number={number} suit={suit} />
			</PokerHolder>			
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
		const index = Math.ceil(i/13);
		let ret = "";
		switch(index){
			case 1:
				ret = "spade";
				break;
			case 2:
				ret = "heart";
				break;
			case 3:
				ret = "diamond";
				break;
			case 4:
				ret = "club";
				break;
		}
		return ret;
	}

	setPkInfo(numberList){
		const ret = [];
		const len = numberList.length;
		for(let i=len; i >0; i--){
			const index = i-1;
			const pkNumber = numberList[index];
			const pkInfo={
				pkNumber:pkNumber,
				number:0,
				state:"refresh",
				suit:null,
				color:null,
				interlockIndex:null
			};
			ret[index] = pkInfo;

			pkInfo["number"] = this.getPokerNumber(pkNumber);

			const suit = this.getPokerSuit(pkNumber);
			const isBlack = suit === "club" || suit === "spade";
			pkInfo["color"] = isBlack?"b":"r";
			pkInfo["suit"] = suit;
			if(i === len){
				pkInfo["interlockIndex"] = -1;
				continue;
			}
			const nextPK = ret[index+1];
			//
			pkInfo["interlockIndex"] = index+1;	
			//	
			const isSameColor = nextPK["color"] === pkInfo["color"];
			if(isSameColor)
				continue;

			const isNextNumber =  nextPK["number"] -1 === pkInfo["number"];
			if(!isNextNumber)
				continue;
			pkInfo["interlockIndex"] = index+1;			
		}
		return ret;
	}
}

function PokerHolder(props){
	const { children, index, spacing, Draggable,state} = props;
	const style={
		top: index * spacing
	};
	const pkClassName = `pokerHolder ${state==="dragging"?"dragging":""}`						
	return(
		<div className={pkClassName} draggable={true} style={style}
			onDragStart={(e)=>{props.onPokerDragStart(e , index)}}
			onDrag={(e)=>{props.onPokerDrag(e, index)}}
			onDragEnd={(e)=>{props.onPokerDragEnd(e, index)}}
			>
			{children}
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
			<div className="pokerCard" >
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