//JavaScript
var options = getOptions();

var family = new FamilyTree(document.getElementById('tree'), {
    mouseScrool: FamilyTree.none,
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
            [
                { type: 'select', options: [{ value: 'bg', text: 'Bulgaria' }, { value: 'ru', text: 'Russia' }, { value: 'gr', text: 'Greece' }], label: 'Country', binding: 'country' },
                { type: 'textbox', label: 'City', binding: 'city' },
            ],
            { type: 'textbox', label: 'Photo Url', binding: 'photo', btn: 'Upload' },
        ]
    },
});

family.on('field', function (sender, args) {
    if (args.name === 'born') {
        const date = new Date(args.value);
        // If it's a valid date, format it
        if (!isNaN(date.getTime())) {
            args.value = date.toLocaleDateString();
        } else {
            // Otherwise, just show the original string
            args.value = args.value;
        }
    }
});

family.load(
    [
        { id: 1, pids: [2], gender: 'male', photo: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/family_tree/aragorn.png', name: 'Aragon Elessar II', born: 'March 1, 2931 of the Third Age', died: 'March 1, 120 of the Fourth Age' },
        { id: 2, pids: [1], gender: 'female', photo: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/family_tree/arwen.png', name: 'Arwen Undómiel', born: '41 of the Third Age', died: '121 of the Fourth Age' },
        { id: 3, mid: 2, fid: 1, gender: 'male', photo: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/family_tree/eldarion.png', name: 'Eldarion', born: 'Unknown', died: 'around 220 of the Fourth Age' },
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