import { FC, useMemo, useState } from "react";
import styled from "styled-components";
import { defaultPageSizeOptions } from "../DataTable.const";
import { useTableContext } from "./modules/table/Table.context";

const PageNumber = styled.div<{ $isCurrentPage: boolean }>(({ $isCurrentPage }) => {
    return {
        height: 50,
        width: 50,
        backgroundColor: $isCurrentPage ? 'blue' : 'red',
    }
});

const PaginationWrapper = styled.div({
    display: 'flex',
})


const Pagination: FC = () => {
    const ctx = useTableContext();
    const maxPages = 10;
    const [pagesDisplayed, setPagesDisplayed] = useState<number>(0);
    const pages = useMemo<number[]>(() => {
        let pagesArrayLength = 0;

        if (ctx?.tableData?.length && ctx?.pageSize) {
            pagesArrayLength = Math.ceil(ctx?.tableData?.length / ctx?.pageSize);
        }
        const pagesArray = new Array(pagesArrayLength).fill('')
            .map((_val, index) => index);
        if (ctx?.page && (pagesArray.length < ctx?.page) && ctx?.setPage) {
            ctx?.setPage(0);
        }
        return pagesArray;
    }, [ctx]);

    return <div>
        <select
            onChange={(ev) => {
                if (ctx?.setPageSize) {
                    ctx?.setPageSize(Number(ev.target.value));
                }
            }}
            value={ctx?.pageSize}
        >
            {
                defaultPageSizeOptions.map(option =>
                    <option value={option} key={option}>{option}</option>
                )
            }
        </select>
        {
            ctx &&
            <div>Showing {ctx?.page * ctx?.pageSize} - {(ctx?.page + 1) * ctx?.pageSize} Total Rows: {ctx?.tableData?.length}</div>
        }
        <PaginationWrapper>
            {

                pages.length > maxPages &&
                <button
                    onClick={() => {
                        setPagesDisplayed(pagesDisplayed - 1)
                    }}
                    disabled={pagesDisplayed <= 0}
                >
                    Back
                </button>
            }
            {pages && pages.slice(pagesDisplayed, pagesDisplayed + maxPages).map((page, i) =>
                <PageNumber
                    key={i}
                    onClick={() => {
                        if (ctx?.setPage)
                            ctx?.setPage(page)
                    }}
                    $isCurrentPage={ctx?.page === page}
                >
                    {page + 1}
                </PageNumber>
            )}
            {
                pages.length > maxPages &&
                <button
                    onClick={() => {
                        setPagesDisplayed(pagesDisplayed + 1)
                    }}
                    disabled={pagesDisplayed + maxPages >= pages.length}
                >
                    Next
                </button>
            }
        </PaginationWrapper>
    </div>
};

export default Pagination;