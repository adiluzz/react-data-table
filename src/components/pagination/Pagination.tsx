import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import { useMemo, useState } from "react";
import { defaultPageSizeOptions } from "../data_table/DataTable.const";
import { numberWithCommas } from '../data_table/DataTable.utils';
import { useTableContext } from "../table/Table.context";
import { PageNumber, PageSizeSelect, PagesWrapper, PaginationWrapper, RowsPerPageTitle } from './Pagination.components';


const Pagination = <T,>() => {
    const ctx = useTableContext<T>();
    const maxPages = window.innerWidth > 920 ? 10 : 5;
    const [pagesDisplayed, setPagesDisplayed] = useState<number>(0);
    const pages = useMemo<number[]>(() => {
        let pagesArrayLength = 0;

        if (ctx?.tableData) {
            pagesArrayLength = Math.ceil(ctx.tableData.length / ctx.pageSize);
        }

        const pagesArray = new Array(pagesArrayLength)
            .fill('')
            .map((_val, index) => index);

        if (ctx?.page && (pagesArray.length < ctx?.page) && ctx?.setPage) {
            ctx?.setPage(0);
        }
        return pagesArray;
    }, [ctx]);

    return <PaginationWrapper>
        {
            ctx?.pageSize && ctx?.tableData && (ctx?.pageSize < ctx.tableData.length) &&
            <div>
                <RowsPerPageTitle>Rows per page</RowsPerPageTitle>
                <PageSizeSelect
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
                </PageSizeSelect>
            </div>
        }
        {
            ctx && ctx?.tableData?.length &&
            <div>Showing {ctx?.page * ctx?.pageSize} - {((ctx?.page + 1) * ctx?.pageSize) < ctx?.tableData?.length ? (ctx?.page + 1) * ctx?.pageSize : ctx.tableData?.length} of {numberWithCommas(ctx?.tableData?.length)}</div>
        }
        <PagesWrapper>
            {

                pages.length > maxPages &&
                <>
                    <PageNumber>
                        <FirstPageIcon
                            onClick={() => {
                                setPagesDisplayed(0);
                            }}
                        />
                    </PageNumber>
                    <PageNumber>
                        <ArrowBackIosNewIcon
                            onClick={() => {
                                if (!(pagesDisplayed <= 0)) {
                                    setPagesDisplayed(pagesDisplayed - 1)
                                }
                            }}
                        />
                    </PageNumber>
                </>
            }
            {pages && pages.length > 1 && pages.slice(pagesDisplayed, pagesDisplayed + maxPages).map((page, i) =>
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
                <>
                    <PageNumber>
                        <ArrowForwardIosIcon
                            onClick={() => {
                                if (!(pagesDisplayed + maxPages >= pages.length)) {
                                    setPagesDisplayed(pagesDisplayed + 1)
                                }
                            }}
                        />
                    </PageNumber>
                    <PageNumber>
                        <LastPageIcon
                            onClick={() => {
                                setPagesDisplayed(pages.length - maxPages)
                            }}
                        />
                    </PageNumber>
                </>
            }

        </PagesWrapper>
    </PaginationWrapper>
};

export default Pagination;