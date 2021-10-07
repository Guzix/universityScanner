import React, {useEffect, useRef, useState} from "react";
import {Dropdown, DropdownButton, InputGroup} from "react-bootstrap";
import {t} from "../misc/misc";


interface Props {

    recordsPerPage: number;

    pageNumber: number;

    totalElements: number;

    pageSize: number;

    placeFooter: boolean;

    setPage: (page: number) => void;

    setPageSize: (size: number) => void;
}


export const UniversalPagination = ({
                                        recordsPerPage,
                                        pageNumber,
                                        totalElements,
                                        pageSize,
                                        placeFooter,
                                        setPage,
                                        setPageSize
                                    }: Props,
) => {
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pager, setPager] = useState({} as any);
    const [totalPages, setTotalPages] = useState(0);


    const setPagination = (
        totalCount: number,
        pageNumber: number,
        recordsPerPage: number
    ) => {
        const pData = paginationService.getPager(
            totalCount,
            pageNumber,
            recordsPerPage
        );
        setPager({...pData});
        setTotalPages(pData.totalPages)
    };


    useEffect(() => {
        setCurrentPage(pageNumber);
    }, [pageNumber]);


    useEffect(() => {
        setTotalCount(totalElements)
    }, [totalElements])


    useEffect(() => {
        setPagination(totalElements, pageNumber, recordsPerPage)
    }, [totalCount, currentPage, totalElements, pageSize])

    return (
        <div>
            {totalCount > 0 && (
            <div className={placeFooter ? "table-footer d-flex justify-content-between align-items-center mb-3"
                                        : "d-flex align-items-end flex-column bd-highlight"}>
                <DropdownButton title={pageSize} variant="outline-primary">
                    <Dropdown.Item onSelect={() => setPageSize(5)}>5</Dropdown.Item>
                    <Dropdown.Item onSelect={() => setPageSize(10)}>10</Dropdown.Item>
                    <Dropdown.Item onSelect={() => setPageSize(25)}>25</Dropdown.Item>
                    <Dropdown.Item onSelect={() => setPageSize(50)}>50</Dropdown.Item>
                    <Dropdown.Item onSelect={() => setPageSize(100)}>100</Dropdown.Item>
                </DropdownButton>
                {placeFooter ?
                    <div className="records-count d-sm-block d-none text-secondary">
                        Showing {pager.startIndex + 1} to {pager.endIndex + 1} of{" "}
                        {totalCount} records
                    </div>: <div/>
                }
                <nav className="pages mt-2">
                    <ul className="pagination">
                        <li
                            className={
                                currentPage === 1 ? "disabled page-item" : "page-item"
                            }
                        >
                            <a
                                href="#!"
                                className="page-link"
                                onClick={(e) => {
                                    if (currentPage !== 1) {
                                        e.preventDefault();
                                        setPage(currentPage - 1)
                                    }
                                }}
                            >
                                &lt;
                            </a>
                        </li>
                        {pager.pages &&
                        pager.pages.map((page: number, index: number) => {
                            return (
                                <li
                                    key={index}
                                    className={
                                        currentPage === page
                                            ? "custom-disabled active page-item"
                                            : "page-item"
                                    }
                                >
                                    <a
                                        className="page-link"
                                        href="#!"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setPage(page);
                                        }}
                                    >
                                        {page}
                                    </a>
                                </li>
                            );
                        })}
                        <li
                            className={
                                currentPage + 1 > totalPages
                                    ? "disabled page-item"
                                    : "page-item"
                            }
                        >
                            <a
                                className="page-link"
                                href="#!"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setPage(currentPage + 1);
                                }}
                            >
                                &gt;
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
            )}
        </div>
    );
};


export const paginationService = {
    getPager,
}

function getPager(
    totalItems: number,
    currentPage: number = 1,
    pageSize: number = 10
) {
    // calculate total pages
    let totalPages = Math.ceil(totalItems / pageSize)

    // ensure current page isn't out of range
    if (currentPage < 1) {
        currentPage = 1
    } else if (currentPage > totalPages) {
        currentPage = totalPages
    }

    let startPage: number, endPage: number
    if (totalPages <= 10) {
        // less than 10 total pages so show all
        startPage = 1
        endPage = totalPages
    } else {
        // more than 10 total pages so calculate start and end pages
        if (currentPage <= 6) {
            startPage = 1
            endPage = 10
        } else if (currentPage + 4 >= totalPages) {
            startPage = totalPages - 9
            endPage = totalPages
        } else {
            startPage = currentPage - 5
            endPage = currentPage + 4
        }
    }

    // calculate start and end item indexes
    let startIndex = (currentPage - 1) * pageSize
    let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1)

    // create an array of pages to ng-repeat in the pager control
    let pages = Array.from(Array(endPage + 1 - startPage).keys()).map(
        (i) => startPage + i
    )

    // return object with all pager properties required by the view
    return {
        totalItems: totalItems,
        currentPage: currentPage,
        pageSize: pageSize,
        totalPages: totalPages,
        startPage: startPage,
        endPage: endPage,
        startIndex: startIndex,
        endIndex: endIndex,
        pages: pages,
    }
}