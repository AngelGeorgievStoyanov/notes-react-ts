export function sliceContent(content: string, maxLength: number) {
    if (content.length > maxLength) {

        let slicedContent = content.slice(0, maxLength - 3);
        const lastSpaceIndex = slicedContent.lastIndexOf(' ');
        slicedContent = slicedContent.slice(0, lastSpaceIndex);
        if (slicedContent.length < content.length) {
            slicedContent += '...';
        }
        return slicedContent;
    } else {
        return content;
    }
}

export const pageSize = [5,10]
