import {useMemo, useState} from "react";
import styles from "../styles/TreeView.module.scss";

export type TreeItem = {
  name : string,
  children ?: TreeItem[]
}

export default function TreeList ({items} : {items: TreeItem[]}) {
  return (
    <ul className={styles.TreeView}>
      { items.map((item, i) => <TreeListItem key={i} item={item} />)}
    </ul>
  );
}

function TreeListItem ({item} : {item: TreeItem}) {
  const [active, setActive] = useState(false);
  const cl = useMemo(() => (item.children ? (styles.Caret + (active ? (' ' + styles.CaretDown) : '')) : ''), [active, item.children]);
  return (
    <li>
      <span onClick={() => setActive(!active)} className={cl}>{item.name}</span>
      <span className={styles.Info}>({item.children?.length})</span>
      { item.children && active && <TreeList items={item.children} /> }
    </li>
  )
}
