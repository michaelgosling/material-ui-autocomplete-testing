import React, {
  useEffect,
  useRef,
  cloneElement,
  createContext,
  forwardRef,
  useContext,
} from "react";
import PropTypes from "prop-types";
import { Autocomplete, AutocompleteRenderGroupParams } from "@material-ui/lab";
import { VariableSizeList, ListChildComponentProps } from "react-window";
import {
  Typography,
  TextField,
  useMediaQuery,
  ListSubheader,
} from "@material-ui/core";
import { useTheme, makeStyles } from "@material-ui/core/styles";

const LISTBOX_PADDING = 8; // px

const renderRow = (props: ListChildComponentProps) => {
  const { data, index, style } = props;
  return cloneElement(data[index], {
    style: {
      ...style,
      top: (style.top as number) + LISTBOX_PADDING,
    },
  });
};

const OuterElementContext = createContext({});

const OuterElementType = forwardRef<HTMLDivElement>((props, ref) => {
  const outerProps = useContext(OuterElementContext);
  return <div ref={ref} {...props} {...outerProps} />;
});

const useResetCache = (data: any) => {
  const ref = useRef<VariableSizeList>(null);
  useEffect(() => {
    if (ref.current != null) {
      ref.current.resetAfterIndex(0, true);
    }
  }, [data]);
  return ref;
};

// ADAPT THAT SHIT FOR THE WINDOW OF REACT
const ListBoxComponent = forwardRef<HTMLDivElement>(function ListBoxComponent(
  props,
  ref
) {
  const { children, ...other } = props;
  const itemData = React.Children.toArray(children);
  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up("sm"), { noSsr: true });
  const itemCount = itemData.length;
  const itemSize = smUp ? 36 : 48;

  const getChildSize = (child: React.ReactNode) =>
    React.isValidElement(child) && child.type === ListSubheader ? 48 : itemSize;

  const getHeight = () =>
    itemCount > 8
      ? 8 * itemSize
      : itemData.map(getChildSize).reduce((a, b) => a + b, 0);

  const gridRef = useResetCache(itemCount);

  return (
    <div ref={ref}>
      <OuterElementContext.Provider value={other}>
        <VariableSizeList
          itemData={itemData}
          height={getHeight() + 2 * LISTBOX_PADDING}
          width="100%"
          ref={gridRef}
          outerElementType={OuterElementType}
          innerElementType="ul"
          itemSize={(index) => getChildSize(itemData[index])}
          overscanCount={5}
          itemCount={itemCount}
        >
          {renderRow}
        </VariableSizeList>
      </OuterElementContext.Provider>
    </div>
  );
});

const useStyles = makeStyles({
  listBox: {
    boxSizing: "border-box",
    "& ul": {
      padding: 0,
      margin: 0,
    },
  },
});

const renderGroup = (params: AutocompleteRenderGroupParams) => [
  <ListSubheader key={params.key} component="div">
    {params.group}
  </ListSubheader>,
  params.children,
];

interface IProps {
  id: string;
  options: string[];
  label: string;
}

const CustomListBox = (props: IProps) => {
  const classes = useStyles();

  return (
    <Autocomplete
      id={props.id}
      style={{ width: 300 }}
      disableListWrap
      // @ts-ignore
      classes={classes}
      ListboxComponent={
        ListBoxComponent as React.ComponentType<
          React.HTMLAttributes<HTMLElement>
        >
      }
      renderGroup={renderGroup}
      options={props.options}
      renderInput={(params) => (
        <TextField {...params} variant="outlined" label={props.label} />
      )}
      renderOption={(option) => <Typography noWrap>{option}</Typography>}
    />
  );
};

export default CustomListBox;
