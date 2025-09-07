### Requirement

- User should able to add text,image
- Design in such a way user should able to other kinds of element
- Save the document to a db or file

### UML

![image](https://www.plantuml.com/plantuml/img/ZLHDQ-Cm4BthLmovrAMab3sQDZImBGHww9AzbM8czj28jQKWJSfss_tlbMn9iTtYH1UZcVVcusd6jvRHyBwfnHci-QqciCGirOiLzezKEpJOG5cZjKjc8pTxfbMfrLh-8xWQG-wrujRpuqguU3TJn_cN6yi6IuODMkeYv71NKqEAZz8nabjUfC7rzT2nMC2x07Skm92go6JdEJY0-2z4n_nDVpbWvi3kqladEQi6NoYHfByLE-Jj9FKCLcfBHZAgal8kBweg19FDBhGG5MW1bvSVYsJfa0FJCPqcb7uaOwLbSjMS4cKaU8yz9Rh5LyegPCmTm6dngcLrq77zw-54vBsiwIXqfB2FxWLkkGTz-trxIAjdtzZYlrXF6EYVkjotANpMUBch96jpbDsrcIB4sQAkQFTSjIlaAJpxSn02gwe8Y2nyqmP5NVhJM61TVndcOQ4fSwNBFFc2pJg06y7Xx1nAyTkJfHKQ5k3zxQ9aetKPmlpJ5goBa2aRlExIMbrAPAdLeJJOeeK6rLjit8haci_Jfa0EiuYS2J5gsWCJgqFEliFqfpx2nAtJrlr1Fm40)

```plantuml
@startuml
' Style settings
skinparam classAttributeIconSize 0
skinparam classFontSize 20

' =============================
' Abstract base class: Element
' =============================
abstract class Element <<abstract class>> {
    + render(): str
}

class Text {
    - text: str
    + render(): str
}

class Image {
    - image_path: str
    + render(): str
}

' Inheritance: Text and Image implement Element
Text ..|> Element
Image ..|> Element

' ================================
' Abstract base class: Persistence
' ================================
abstract class Persistence <<abstract class>> {
    + save(data:str): void
}

class SQL {
    + save(data:str): void
}

class File {
    + save(data:str): void
}

' Inheritance: SQL and File implement Persistence
SQL ..|> Persistence
File ..|> Persistence

' =============================
' Document and DocumentEditor
' =============================
class Document {
    - elements: list[Element]
    + add_element(element: Element): void
    + render_all(): str
}

class DocumentEditor {
    - doc: Document
    - storage: Persistence
    + add_text(text: str): void
    + add_image(image_path: str): void
    + save_to_storage(): void
}

' Association: Document has many Elements
Document --> Element : "has many"

DocumentEditor --> Document : "has"
DocumentEditor --> Persistence : "has"

@enduml
```

### Code

```py
from abc import ABC, abstractmethod


class Element(ABC):
    @abstractmethod
    def render(self) -> str:
        pass


class Text(Element):
    def __init__(self, txt: str) -> None:
        self.__text = txt

    def render(self) -> str:
        return self.__text


class Image(Element):
    def __init__(self, image_path: str) -> None:
        self.__image_path = image_path

    def render(self) -> str:
        return f"[image : {self.__image_path}]"


class Persistence(ABC):
    @abstractmethod
    def save(self, data: str) -> None:
        pass


class SQL(Persistence):
    def save(self, data: str) -> None:
        print("saving data to sql db")


class File(Persistence):
    def save(self, data: str) -> None:
        print("saving data to file")


class Document:
    def __init__(self) -> None:
        self.__elements: list[Element] = []

    def add_element(self, element: Element) -> None:
        self.__elements.append(element)

    def render_all(self) -> str:
        res = ""
        for element in self.__elements:
            res += element.render()
        return res


class DocumentEditor:
    def __init__(self, doc: Document, storage: Persistence) -> None:
        self.__doc = doc
        self.__storage = storage

    def add_text(self, txt: str) -> None:
        self.__doc.add_element(Text(txt))

    def add_image(self, image_path: str) -> None:
        self.__doc.add_element(Image(image_path))

    def save(self) -> None:
        data = self.__doc.render_all()
        self.__storage.save(data)


# Usage
if __name__ == "__main__":
    document = Document()
    storage = File()
    editor = DocumentEditor(document, storage)
    editor.add_text("Hello, world!")
    editor.add_image("path/to/image.jpg")
    editor.save()
```
