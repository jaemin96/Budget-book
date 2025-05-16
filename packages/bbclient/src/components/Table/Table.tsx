import { BaseProps } from "@/common/types";
import styles from "./styles/table.module.scss";
import classNames from "classnames";

interface Column {
  label: string;
  dataIndex: string;
}

interface TableProps extends BaseProps {
  columns: Column[];
  data: Record<string, any>[];
}

const Table: React.FC<TableProps> = ({ columns, data }) => {
  return (
    <>
      <table className={classNames(styles.table)}>
        <thead className={classNames(styles.table__head)}>
          <tr className={classNames(styles.table__headRow)}>
            {columns.map((col) => (
              <th
                key={col.dataIndex}
                className={classNames(styles.table__headCell)}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={classNames(styles.table__body)}>
          {data?.map((row, rowIndex) => (
            <tr
              key={row.id ?? rowIndex}
              className={classNames(styles.table__bodyRow)}
            >
              {columns.map((col) => (
                <td
                  key={col.dataIndex}
                  className={classNames(styles.table__bodyCell)}
                >
                  {row[col.dataIndex]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Table;
