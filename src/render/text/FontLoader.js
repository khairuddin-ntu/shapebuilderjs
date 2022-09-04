import {
    FileLoader,
    Loader
} from 'three';

export default class FontLoader extends Loader {
    load(url, onLoad, onProgress, onError) {
        new FileLoader(this.manager)
            .setPath(this.path)
            .setRequestHeader(this.requestHeader)
            .setWithCredentials(this.withCredentials)
            .load(
                url, function (text) {
                    if (onLoad) onLoad(JSON.parse(text));
                }, onProgress, onError
            );
    }
}
