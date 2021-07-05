export const SELECTED_TAB = 'SELECTED_TAB';

export const setSelectedTab = (tabIndex) => ({
    type: SELECTED_TAB,
    tabIndex: tabIndex,
});
