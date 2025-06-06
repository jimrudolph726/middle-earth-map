//JavaScript
var options = getOptions();

var family = new FamilyTree(document.getElementById('tree'), {
    mouseScrool: FamilyTree.action.zoom,
    scaleInitial: options.scaleInitial,
    mode: 'dark',
    template: 'hugo',
    roots: [3],
    nodeMenu: {
        edit: { text: 'Edit' },
        details: { text: 'Details' },
    },
    nodeTreeMenu: true,
    nodeBinding: {
        field_0: 'name',
        field_1: 'born',
        field_2: 'died',
        img_0: 'photo'
    },
    editForm: {
        titleBinding: "name",
        photoBinding: "photo",
        addMoreBtn: 'Add element',
        addMore: 'Add more elements',
        addMoreFieldName: 'Element name',
        generateElementsFromFields: false,
        elements: [
            { type: 'textbox', label: 'Full Name', binding: 'name' },
            { type: 'textbox', label: 'Date Of Birth', binding: 'born' },
            { type: 'textbox', label: 'Date Of Death', binding: 'died' },
            { type: 'textbox', label: 'Photo Url', binding: 'photo', btn: 'Upload' },
        ]
    },
});

family.on('field', function (sender, args) {
    if (args.name === 'born') {
        // Only try to parse ISO-like dates (yyyy-mm-dd)
        if (/^\d{4}-\d{2}-\d{2}$/.test(args.value)) {
            const date = new Date(args.value);
            args.value = date.toLocaleDateString();
        }
        // Otherwise leave as-is (e.g. "Third Age 41")
    }
});


family.load(
    [
        { id: 1, pids: [2], gender: 'male', photo: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/family_tree/elrond.png', name: 'Elrond', born: 'Around 532 of the First Age', died: 'No death, left Middle-earth on September 29, 3021 of the Third Age' },
        { id: 2, pids: [1], gender: 'female', photo: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/family_tree/celebrian.png', name: 'Celebrian', born: 'Likely born between Second Age 750 and Second Age 900', died: 'No death, left Middle-earth in 2510 of the Third Age' },
        { id: 3, pids: [4], gender: 'male', photo: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/family_tree/aragorn.png', name: 'Aragon Elessar II', born: 'March 1, 2931 of the Third Age', died: 'March 1, 120 of the Fourth Age' },
        { id: 4, pids: [3], mid: 2, fid: 1, gender: 'female', photo: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/family_tree/arwen.png', name: 'Arwen Undómiel', born: 'Third Age 41', died: 'Fourth Age 121' },
        { id: 5, mid: 4, fid: 3, gender: 'male', photo: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/family_tree/eldarion.png', name: 'Eldarion', born: 'Unknown', died: 'Around 220 of the Fourth Age' },
    ]
);

function getOptions(){
    const searchParams = new URLSearchParams(window.location.search);
    var fit = searchParams.get('fit');
    var enableSearch = true;
    var scaleInitial = 1;
    if (fit == 'yes'){
        enableSearch = false;
        scaleInitial = FamilyTree.match.boundary;
    }
    return {enableSearch, scaleInitial};
}