import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import { FC } from "react";

type ConditionalArrowProps = {
    condition: boolean;

}

const ConditionalArrow: FC<ConditionalArrowProps> = ({ condition }) => {
    return <>
        {
            condition ?
                <ArrowUpward />
                :
                <ArrowDownward />
        }
    </>
};

export default ConditionalArrow;