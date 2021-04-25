class AssistantRoutePath {
  final String name;

  AssistantRoutePath.home() : name = "HOME";
  AssistantRoutePath.expeditionList() : name = "EXPEDITION-LIST";
  AssistantRoutePath.expeditionDetails() : name = "EXPEDITION-DETAILS";
  AssistantRoutePath.expeditionMap() : name = "EXPEDITION-MAP";
  AssistantRoutePath.about() : name = "ABOUT";
  AssistantRoutePath.unknown() : name = "UNKNOWN";

  @override
  String toString() {
    return "AssistantRoutePath name: $name";
  }
}
