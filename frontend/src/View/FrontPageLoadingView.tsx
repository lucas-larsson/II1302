import { ErrorText, OuterBox, Text } from "../Styles/BaseStyles";
import { ReactComponent as Ripple } from '../Icons/ripple.svg';
interface Props{
    errorMsg:string
}

export default function FrontPageLoadingView(props:Props){


    return <OuterBox>
        <Ripple height={128} width={128}></Ripple>
        {props.errorMsg == "" ? <Text>Loading data from plant, please wait.</Text> : <ErrorText>Could not load settings { ` (${props.errorMsg}` + ")"}</ErrorText>}
    </OuterBox>
}