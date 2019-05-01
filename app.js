const freezRow = (element, lastColumnIndex) => {
    document.querySelectorAll(`${element} tr`).forEach(function (tr) {

        let td = Array.from(tr.querySelectorAll('td'))
            .slice(0, lastColumnIndex);

        if (td.length < lastColumnIndex) {
            td = Array.from(tr.querySelectorAll('th'))
                .slice(0, lastColumnIndex);

            if (td.length < lastColumnIndex)
                return;
        }

        td.forEach((x, i) => {
            x.style.position = 'sticky';
            x.style.position = '-webkit-sticky';
            x.style.background = '#eaeaea';
            x.style.minWidth = '100px';
            x.style.maxWidth = '100px';
            x.style.width = '100px';
            x.style.overflow = 'hidden';
            x.style.textOverflow = 'ellipsis';
            x.style.left = `${i * 100}px`;
        });
    });
}

freezRow('table', 3);